import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/utils/auth';

type ProtectedRoute = {
  prefix: string;
  role?: 'admin' | 'member';
};

const PROTECTED_ROUTES: ProtectedRoute[] = [{ prefix: '/admin', role: 'admin' }, { prefix: '/home' }, { prefix: '/api/returns' }];

function isProtected(pathname: string) {
  return PROTECTED_ROUTES.find((r) => pathname.startsWith(r.prefix));
}

export default function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const pathname = req.nextUrl.pathname;

  const rule = isProtected(pathname);

  // Jika route tidak dilindungi, lanjutkan
  if (!rule) return NextResponse.next();

  // Cek token
  if (!token) return NextResponse.redirect(new URL('/auth', req.url));

  const payload = verifyToken(token);
  if (!payload) return NextResponse.redirect(new URL('/auth', req.url));

  // Cek role jika diperlukan
  if (rule.role && payload.role !== rule.role) return NextResponse.redirect(new URL('/auth', req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
