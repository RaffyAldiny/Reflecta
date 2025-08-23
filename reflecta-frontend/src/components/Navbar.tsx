import Link from 'next/link';
import { cookies } from 'next/headers';
import LogoutButton from './LogoutButton';

type User = { id: number; username: string };

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE && process.env.NEXT_PUBLIC_API_BASE.replace(/\/$/, '')) ||
  'http://127.0.0.1:8000';

export default async function Navbar() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
  let me: User | null = null;
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
      cache: 'no-store',
    });
    if (res.ok) me = await res.json();
  } catch {}

  return (
    <header className="border-b border-neutral-800/70 supports-[backdrop-filter]:bg-neutral-950/60 backdrop-blur-md sticky top-0 z-10">
      <nav className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-semibold tracking-tight text-lg hover:opacity-90">Reflecta</Link>
        <span className="flex-1" />
        {!me ? (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm hover:underline">Login</Link>
            <Link href="/register" className="text-sm hover:underline">Register</Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-400">Hi, <b className="text-neutral-200">{me.username}</b></span>
            <LogoutButton />
          </div>
        )}
      </nav>
    </header>
  );
}
