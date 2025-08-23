import { cookies } from 'next/headers';
import Link from 'next/link';

type User = { id: number; username: string; email?: string };

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE && process.env.NEXT_PUBLIC_API_BASE.replace(/\/$/, '')) ||
  'http://127.0.0.1:8000';

async function getMeServer(): Promise<User | null> {
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

function Card(props: { title: string; desc: string; href: string }) {
  return (
    <Link
      href={props.href}
      className="group rounded-2xl border border-neutral-800 bg-neutral-900/30 p-5 hover:bg-neutral-900/50 transition block"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{props.title}</h3>
        <span className="rounded-full border border-neutral-800 px-2 py-0.5 text-xs text-neutral-400 group-hover:border-neutral-700">Open</span>
      </div>
      <p className="mt-2 text-sm text-neutral-400">{props.desc}</p>
    </Link>
  );
}

export default async function HomePage() {
  const me = await getMeServer();

  if (!me) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome to Reflecta</h1>
        <p className="text-neutral-400 max-w-prose">
          A creative, private space to capture your day with photos, music, moods, and thoughts.
          Log in or create an account to start your journal.
        </p>
        <div className="flex gap-3">
          <Link className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15 transition" href="/login">Login</Link>
          <Link className="rounded-xl border border-white/15 px-4 py-2 hover:bg-white/5 transition" href="/register">Create account</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back, <span className="text-white">{me.username}</span> 👋</h1>
        <p className="text-neutral-400 mt-1">Here are quick actions to start your entry today.</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="New Entry" desc="Write your thoughts and add photos for today." href="/entry/new" />
        <Card title="Music Library" desc="Attach tracks that fit your mood." href="/music" />
        <Card title="Mood Tracker" desc="Log your mood and see trends." href="/mood" />
      </section>

      <section className="rounded-2xl border border-neutral-800 p-5 bg-neutral-900/30">
        <h2 className="font-medium">Today at a glance</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-neutral-300">
          <div className="rounded-xl border border-neutral-800 p-4 bg-neutral-900/30">
            <div className="text-neutral-400 text-xs">Photos</div>
            <div className="text-2xl font-semibold mt-1">0</div>
          </div>
          <div className="rounded-xl border border-neutral-800 p-4 bg-neutral-900/30">
            <div className="text-neutral-400 text-xs">Words</div>
            <div className="text-2xl font-semibold mt-1">0</div>
          </div>
          <div className="rounded-xl border border-neutral-800 p-4 bg-neutral-900/30">
            <div className="text-neutral-400 text-xs">Mood</div>
            <div className="text-2xl font-semibold mt-1">—</div>
          </div>
        </div>
        <p className="text-neutral-500 text-xs mt-3">Stats populate once you start creating entries.</p>
      </section>
    </div>
  );
}
