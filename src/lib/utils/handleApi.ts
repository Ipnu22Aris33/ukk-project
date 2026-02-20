import { NextResponse, type NextRequest } from 'next/server';
import { ApiResponse, fail, validationError } from '@/lib/utils/apiResponse';
import { HttpError, Unauthorized } from '@/lib/utils/httpErrors';
import { ZodError } from 'zod';
import { verifyToken } from '@/lib/utils/auth';
import { db } from '@/lib/db';
import { eq, isNull } from 'drizzle-orm';

type HandlerContext = {
  req: NextRequest;
  res: NextResponse;
  params: Record<string, string>;
  user?: {
    id: number;
    email: string;
    username: string;
    role: 'admin' | 'staff' | 'member';
    member?: any;
  };
};

type Handler<T = any> = (ctx: HandlerContext) => Promise<ApiResponse<T>>;

type HandleApiOptions = {
  requireAuth?: boolean;
  requireRoles?: ('admin' | 'staff' | 'member')[];
};

export function handleApi<T>(handler: Handler<T>, options: HandleApiOptions = { requireAuth: false }) {
  return async (req: NextRequest, context?: { params?: Promise<Record<string, string>> }) => {
    const res = NextResponse.json(null);

    try {
      const params = context?.params instanceof Promise ? await context.params : (context?.params ?? {});

      // Ambil user dari token
      const token = req.cookies.get('access_token')?.value;

      const payload = token ? verifyToken(token) : undefined;

      const user = payload?.sub
        ? await db.query.users.findFirst({
            where: (u, { and }) => and(eq(u.id, Number(payload.sub)), isNull(u.deletedAt)),
            with: {
              member: true,
            },
            columns: {
              id: true,
              email: true,
              username: true,
              role: true,
            },
          })
        : undefined;

      if (options.requireAuth && !user) {
        throw new Unauthorized('Silakan login terlebih dahulu');
      }

      if (options.requireRoles && user && !options.requireRoles.includes(user.role)) {
        throw new Unauthorized('Anda tidak memiliki akses');
      }

      const result = await handler({ req, res, params, user });

      return NextResponse.json(result, {
        status: result.status ?? 200,
        headers: res.headers,
      });
    } catch (error: any) {
      console.error('\x1b[31m[API ERROR]\x1b[0m', error);

      if (error instanceof HttpError) {
        return NextResponse.json(
          fail(error.message, {
            status: error.status,
          })
        );
      }

      if (error instanceof ZodError) {
        return NextResponse.json(
          validationError(
            error.issues.reduce((acc: Record<string, string[]>, issue) => {
              const path = issue.path.join('.');
              if (!acc[path]) {
                acc[path] = [];
              }
              acc[path].push(issue.message);
              return acc;
            }, {}),
            'Validation Error'
          ),
          { status: 400 }
        );
      }

      return NextResponse.json(fail('Internal Server Error'), { status: 500 });
    }
  };
}
