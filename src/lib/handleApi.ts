import { NextResponse } from 'next/server';
import { ApiResponse, fail } from '@/lib/apiResponse';
import { HttpError } from '@/lib/httpErrors';
import { ZodError } from 'zod';

type HandlerContext = {
  req: Request;
  res: NextResponse;
  params?: Record<string, string>;
};

type Handler<T = any> = (ctx: HandlerContext) => Promise<ApiResponse<T>>;

export function handleApi<T>(handler: Handler<T>) {
  return async (req: Request, ctx?: { params?: Record<string, string> }) => {
    const res = NextResponse.json(null);

    try {
      const result = await handler({ req, res, params: ctx?.params });

      return NextResponse.json(result, {
        status: result.status ?? 200,
        headers: res.headers,
      });
    } catch (error: any) {
      console.error('[API ERROR]', error);

      if (error instanceof HttpError) {
        return NextResponse.json(fail(error.message, error.status), { status: error.status });
      }

      if (error instanceof ZodError) {
        const errors = error.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));

        return NextResponse.json(fail('Validation Error', 400, { errors }), { status: 400 });
      }

      return NextResponse.json(fail('Internal Server Error', 500), { status: 500 });
    }
  };
}
