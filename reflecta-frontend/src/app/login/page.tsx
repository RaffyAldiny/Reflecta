'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi, ApiError, AuthError } from '@/lib/api';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/dashboard';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await authApi.login(identifier.trim(), password);
      try { await authApi.me(); } catch {}
      router.replace(next); router.refresh();
    } catch (err: any) {
      if (err instanceof ApiError || err instanceof AuthError) setError('Invalid username/email or password.');
      else setError('Network error. Is the backend running?');
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-sm">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 p-6 bg-black/30 backdrop-blur">
        <div className="pointer-events-none absolute -top-20 -left-16 h-48 w-48 rounded-full bg-violet-600/30 blur-3xl" />
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>

        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm mb-1">Username or Email</label>
            <input
              className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500/40"
              value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400/40"
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            className="w-full rounded-xl bg-gradient-to-r from-violet-600/40 to-cyan-500/40 px-4 py-2.5 border border-white/10 hover:from-violet-500/50 hover:to-cyan-400/50 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-neutral-300 mt-4">
          No account? <a className="underline" href="/register">Create one</a>
        </p>
      </div>
    </div>
  );
}
