import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type User = { id: number; username: string; email?: string };

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE && process.env.NEXT_PUBLIC_API_BASE.replace(/\/$/, '')) ||
  'http://127.0.0.1:8000';

export async function getMeServer(): Promise<User | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function requireUserServer(nextUrl: string = '/login') {
  const me = await getMeServer();
  if (!me) redirect(`${nextUrl}?next=/dashboard`);
  return me;
}
