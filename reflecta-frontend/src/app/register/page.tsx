'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, ApiError } from '@/lib/api';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await authApi.register(username.trim(), email.trim(), password);
      try { await authApi.me(); } catch {}
      router.replace('/dashboard'); router.refresh();
    } catch (err: any) {
      if (err instanceof ApiError) setError(err.message); else setError('Network error. Is the backend running?');
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-sm">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 p-6 bg-black/30 backdrop-blur">
        <div className="pointer-events-none absolute -top-20 -left-16 h-48 w-48 rounded-full bg-cyan-500/30 blur-3xl" />
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>

        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500/40"
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400/40"
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500/40"
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            className="w-full rounded-xl bg-gradient-to-r from-violet-600/40 to-cyan-500/40 px-4 py-2.5 border border-white/10 hover:from-violet-500/50 hover:to-cyan-400/50 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating…' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-neutral-300 mt-4">
          Already have an account? <a className="underline" href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
