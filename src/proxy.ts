// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PUBLIC_ROUTES = ['/auth'];

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  const token = req.cookies.get('access_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth', req.url), 302);
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/auth', req.url), 302);
  }

  if (pathname.startsWith('/admin') && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/auth', req.url), 302);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
