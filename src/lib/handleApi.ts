import { NextResponse } from 'next/server';
import { ApiResponse, fail } from '@/lib/apiResponse';
import { HttpError } from '@/lib/httpErrors';

type Handler<T = any> = () => Promise<ApiResponse<T>>;

export async function handleApi<T>(handler: Handler<T>) {
  try {
    const response = await handler();

    return NextResponse.json(response, {
      status: response.status ?? 200,
    });
  } catch (error: any) {
    console.error('[API ERROR]', error);

    if (error instanceof HttpError) {
      const res = fail(error.message, error.status);
      return NextResponse.json(res, { status: error.status });
    }

    const res = fail('Internal Server Error', 500);
    return NextResponse.json(res, { status: 500 });
  }
}
