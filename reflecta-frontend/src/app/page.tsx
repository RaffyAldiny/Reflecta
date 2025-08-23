import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 p-8">
        {/* glow accents */}
        <div className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl" />

        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          Your universe of memories
        </h1>
        <p className="mt-3 text-neutral-300 max-w-prose">
          Reflecta is a private space to capture your days with photos, music, moods, and thoughts —
          woven together like constellations.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            className="rounded-xl bg-gradient-to-r from-violet-600/40 to-cyan-500/40 px-5 py-2.5 backdrop-blur hover:from-violet-500/50 hover:to-cyan-400/50 transition border border-white/10"
            href="/login"
          >
            Login
          </Link>
          <Link
            className="rounded-xl px-5 py-2.5 border border-white/15 hover:bg-white/5 transition"
            href="/register"
          >
            Create account
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { t: 'Photos', d: 'Attach your favorite shots.' },
          { t: 'Music', d: 'Soundtrack your day.' },
          { t: 'Moods', d: 'Track feelings over time.' },
        ].map((c, i) => (
          <div key={i} className="rounded-2xl border border-white/10 p-5 bg-black/20">
            <h3 className="font-medium">{c.t}</h3>
            <p className="text-sm text-neutral-300 mt-1">{c.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
