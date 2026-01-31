// app/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';

export default async function RootRedirect() {
  const token = (await cookies()).get('access_token')?.value;

  if (!token) return redirect('/auth');

  const payload = verifyToken(token);
  if (!payload) return redirect('/auth');

  if (payload.role === 'admin') return redirect('/admin');
  return redirect('/home');
}
