'use client';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <section className="relative overflow-hidden rounded-3xl border-2 border-violet-500/30 p-6 md:p-8 bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-lg">
        {/* Enhanced glow accents */}
        <div className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-violet-600/60 blur-3xl animate-pulse-slow" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-cyan-500/50 blur-3xl animate-pulse-slow delay-1000" />

        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-200 to-cyan-200 bg-clip-text text-transparent">
          Your universe of memories
        </h1>
        <p className="mt-4 text-neutral-200 max-w-prose text-lg">
          Reflecta is a private space to capture your days with photos, music, moods, and thoughts —
          woven together like constellations.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3.5 border-2 border-white/20 hover:from-violet-500 hover:to-cyan-400 transition-all duration-300 text-white font-semibold text-center shadow-lg hover:shadow-violet-500/30"
            href="/login"
          >
            Login
          </Link>
          <Link
            className="rounded-xl px-6 py-3.5 border-2 border-violet-500/30 hover:bg-white/10 transition-all duration-300 text-white font-semibold text-center"
            href="/register"
          >
            Create account
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { t: 'Photos', d: 'Attach your favorite shots.', c: 'from-purple-600/40 to-violet-600/40' },
          { t: 'Music', d: 'Soundtrack your day.', c: 'from-blue-600/40 to-cyan-600/40' },
          { t: 'Moods', d: 'Track feelings over time.', c: 'from-violet-600/40 to-purple-600/40' },
        ].map((c, i) => (
          <div key={i} className={`rounded-2xl border-2 border-white/10 p-6 bg-gradient-to-br ${c.c} backdrop-blur-lg`}>
            <h3 className="font-bold text-lg text-white">{c.t}</h3>
            <p className="text-neutral-200 mt-2">{c.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}