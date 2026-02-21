import { NextResponse, type NextRequest } from 'next/server';
import { ApiResponse, fail, validationError } from '@/lib/utils/apiResponse';
import { HttpError, InternalServerError, Unauthorized } from '@/lib/utils/httpErrors';
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
    member?: {
      id: number;
      fullName: string;
      memberCode: string;
      memberClass?: string;
      nis?: string;
      phone?: string;
      address?: string;
    };
  };
};

type Handler<T = any> = (ctx: HandlerContext) => Promise<ApiResponse<T>>;

type HandleApiOptions = {
  requireAuth?: boolean;
  requireRoles?: ('admin' | 'staff' | 'member')[];
};

// Helper function untuk get user dengan member data (tanpa let)
const getUserWithMember = async (userId: number) => {
  try {
    const [userData, memberData] = await Promise.all([
      db.query.users.findFirst({
        where: (u, { and }) => and(eq(u.id, userId), isNull(u.deletedAt)),
        columns: {
          id: true,
          email: true,
          username: true,
          role: true,
        },
      }),
      db.query.members.findFirst({
        where: (m, { eq }) => eq(m.userId, userId),
        columns: {
          id: true,
          fullName: true,
          memberCode: true,
          memberClass: true,
          nis: true,
          phone: true,
          address: true,
        },
      }),
    ]);

    return userData
      ? {
          ...userData,
          member: memberData ?? undefined,
        }
      : undefined;
  } catch (error) {
    console.error('[GetUserWithMember] Error:', error);
    throw new InternalServerError('Gagal mengambil data user');
  }
};

export function handleApi<T>(handler: Handler<T>, options: HandleApiOptions = { requireAuth: false }) {
  return async (req: NextRequest, context?: { params?: Promise<Record<string, string>> }) => {
    const res = NextResponse.json(null);
    const startTime = Date.now();

    try {
      // Parse params
      const params = context?.params instanceof Promise ? await context.params : (context?.params ?? {});

      // Get token from cookies
      const token = req.cookies.get('access_token')?.value;

      // Verify token and get user in one pipeline
      const user = await (async () => {
        if (!token) return undefined;

        const payload = verifyToken(token);
        if (!payload?.sub) return undefined;

        try {
          return await getUserWithMember(Number(payload.sub));
        } catch (error) {
          console.error('[handleApi] Error fetching user:', error);
          throw new Unauthorized('Gagal memuat data user');
        }
      })();

      // Check authentication
      if (options.requireAuth && !user) {
        throw new Unauthorized('Silakan login terlebih dahulu');
      }

      // Check roles
      if (options.requireRoles && user && !options.requireRoles.includes(user.role)) {
        throw new Unauthorized('Anda tidak memiliki akses ke resource ini');
      }

      // Execute handler
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
      console.error('Error details:', error);

      // Handle HttpError (custom errors)
      if (error instanceof HttpError) {
        return NextResponse.json(
          fail(error.message, {
            status: error.status,
          }),
          { status: error.status }
        );
      }

      // Handle Zod validation errors
      if (error instanceof ZodError) {
        const errors = error.issues.reduce((acc: Record<string, string[]>, issue) => {
          const path = issue.path.join('.');
          if (!acc[path]) {
            acc[path] = [];
          }
          acc[path].push(issue.message);
          return acc;
        }, {});

        return NextResponse.json(validationError(errors, 'Validasi gagal'), { status: 400 });
      }

      // Handle database connection errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNRESET') {
        return NextResponse.json(fail('Koneksi database terputus', { status: 503 }), { status: 503 });
      }

      // Handle all other errors
      return NextResponse.json(fail('Terjadi kesalahan internal server', { status: 500 }), { status: 500 });
    }
  };
}