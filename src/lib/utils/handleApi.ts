import { NextResponse, type NextRequest } from 'next/server';
import { ApiResponse, fail, validationError } from '@/lib/utils/apiResponse';
import { HttpError, InternalServerError, Unauthorized } from '@/lib/utils/httpErrors';
import { ZodError } from 'zod';
import { verifyToken } from '@/lib/utils/auth';

type UserFromToken = {
  id: number;
  email: string;
  // username: string;
  role: 'admin' | 'staff' | 'member';
};

type HandlerContext = {
  req: NextRequest;
  res: NextResponse;
  params: Record<string, string>;
  user?: UserFromToken;
};

type Handler<T = any> = (ctx: HandlerContext) => Promise<ApiResponse<T>>;

type HandleApiOptions = {
  requireAuth?: boolean;
  requireRoles?: ('admin' | 'staff' | 'member')[];
};

// Pure function untuk extract user dari token
const extractUserFromToken = (token?: string): UserFromToken | undefined => {
  if (!token) return undefined;
  
  try {
    const payload = verifyToken(token);
    if (!payload?.sub) return undefined;
    
    return {
      id: Number(payload.sub),
      email: payload.email as string,
      // username: payload.username as string,
      role: payload.role as 'admin' | 'staff' | 'member',
    };
  } catch {
    return undefined;
  }
};

// Pure function untuk validasi akses
const validateAccess = (
  user: UserFromToken | undefined,
  options: HandleApiOptions
): HttpError | null => {
  if (options.requireAuth && !user) {
    return new Unauthorized('Silakan login terlebih dahulu');
  }
  
  if (options.requireRoles && user && !options.requireRoles.includes(user.role)) {
    return new Unauthorized('Anda tidak memiliki akses ke resource ini');
  }
  
  return null;
};

export function handleApi<T>(handler: Handler<T>, options: HandleApiOptions = { requireAuth: false }) {
  return async (req: NextRequest, context?: { params?: Promise<Record<string, string>> }) => {
    const startTime = Date.now();
    const res = NextResponse.json(null);

    try {
      // Parse params secara immutable
      const params = context?.params instanceof Promise 
        ? await context.params 
        : (context?.params ?? {});

      // Extract user dari token - pure function, no let
      const user = extractUserFromToken(req.cookies.get('access_token')?.value);

      // Validasi akses - pure function, no let
      const accessError = validateAccess(user, options);
      if (accessError) {
        throw accessError;
      }

      // Execute handler dengan immutable context
      const result = await handler({ req, res, params, user });

      // Log success
      const duration = Date.now() - startTime;
      console.log(`[API] ${req.method} ${req.nextUrl.pathname} - ${result.status || 200} (${duration}ms)`);

      return NextResponse.json(result, {
        status: result.status ?? 200,
        headers: res.headers,
      });
      
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error(`\x1b[31m[API ERROR]\x1b[0m ${req.method} ${req.nextUrl.pathname} (${duration}ms)`);
      
      // Handle HttpError
      if (error instanceof HttpError) {
        return NextResponse.json(
          fail(error.message, { status: error.status }),
          { status: error.status }
        );
      }

      // Handle Zod validation errors
      if (error instanceof ZodError) {
        const errors = error.issues.reduce((acc: Record<string, string[]>, issue) => {
          const path = issue.path.join('.');
          const current = acc[path] ?? [];
          return {
            ...acc,
            [path]: [...current, issue.message]
          };
        }, {});

        return NextResponse.json(
          validationError(errors, 'Validasi gagal'), 
          { status: 400 }
        );
      }

      // Generic error
      console.error('[handleApi] Unhandled error:', error);
      return NextResponse.json(
        fail('Terjadi kesalahan internal server', { status: 500 }), 
        { status: 500 }
      );
    }
  };
}