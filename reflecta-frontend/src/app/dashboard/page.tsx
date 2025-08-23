import Link from 'next/link';
import { requireUserServer } from '@/lib/me-server';

function Card(props: { title: string; desc: string; href: string }) {
  return (
    <Link
      href={props.href}
      className="group relative overflow-hidden rounded-2xl border border-white/10 p-5 bg-black/25 backdrop-blur"
    >
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-violet-600/25 blur-3xl" />
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{props.title}</h3>
        <span className="rounded-full border border-white/15 px-2 py-0.5 text-xs text-neutral-300 group-hover:border-white/25">
          Open
        </span>
      </div>
      <p className="mt-2 text-sm text-neutral-300">{props.desc}</p>
    </Link>
  );
}

export default async function DashboardPage() {
  const me = await requireUserServer('/login');

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back, <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
            {me.username}
          </span> 👋
        </h1>
        <p className="text-neutral-300 mt-1">Here are quick actions to start your entry today.</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="New Entry" desc="Write thoughts and add photos for today." href="/entry/new" />
        <Card title="Music Library" desc="Attach tracks that fit your mood." href="/music" />
        <Card title="Mood Tracker" desc="Log your mood and see trends." href="/mood" />
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-white/10 p-5 bg-black/25 backdrop-blur">
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-cyan-500/25 blur-3xl" />
        <h2 className="font-medium">Today at a glance</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-neutral-200">
          <div className="rounded-xl border border-white/10 p-4 bg-black/20">
            <div className="text-neutral-400 text-xs">Photos</div>
            <div className="text-2xl font-semibold mt-1">0</div>
          </div>
          <div className="rounded-xl border border-white/10 p-4 bg-black/20">
            <div className="text-neutral-400 text-xs">Words</div>
            <div className="text-2xl font-semibold mt-1">0</div>
          </div>
          <div className="rounded-xl border border-white/10 p-4 bg-black/20">
            <div className="text-neutral-400 text-xs">Mood</div>
            <div className="text-2xl font-semibold mt-1">—</div>
          </div>
        </div>
        <p className="text-neutral-400 text-xs mt-3">Stats populate once you start creating entries.</p>
      </section>
    </div>
  );
}
