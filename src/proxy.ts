// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PUBLIC_ROUTES = ['/', '/auth', '/api/auth'];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow public routes
  if (PUBLIC_ROUTES.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  const token = req.cookies.get('access_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname.startsWith('/admin') && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/:path',
  ],
};
