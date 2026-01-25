import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

type ProtectedRoute = {
  prefix: string;
  role?: 'admin' | 'member';
};

const PROTECTED_ROUTES: ProtectedRoute[] = [
  { prefix: '/admin', role: 'admin' },
  { prefix: '/home' },
];

function isProtected(pathname: string) {
  return PROTECTED_ROUTES.find((r) => pathname.startsWith(r.prefix));
}

export default function proxy(req: NextRequest) {
  // const token = req.cookies.get('token')?.value;
  // const pathname = req.nextUrl.pathname;

  // const rule = isProtected(pathname);

  // if (!rule) return NextResponse.next();

  // if (!token) return NextResponse.redirect(new URL('/login', req.url));

  // const payload = verifyToken(token);
  // if (!payload) return NextResponse.redirect(new URL('/login', req.url));

  // if (rule.role && payload.role !== rule.role)
  //   return NextResponse.redirect(new URL('/login', req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/home/:path*'],
};
