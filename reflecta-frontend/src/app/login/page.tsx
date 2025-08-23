'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi, ApiError, AuthError } from '@/lib/api';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(''); // username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await authApi.login(identifier.trim(), password);     // sets cookies
      // verify session, then force-refresh so server components see the cookie immediately
      try { await authApi.me(); } catch { /* ignore */ }
      router.replace(next);
      router.refresh();
    } catch (err: any) {
      if (err instanceof ApiError || err instanceof AuthError) setError('Invalid username/email or password.');
      else setError('Network error. Is the backend running on 127.0.0.1:8000?');
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-sm">
      <h1 className="text-2xl font-semibold mb-4 tracking-tight">Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Username or Email</label>
          <input
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/50 px-3 py-2 outline-none focus:ring-2 focus:ring-white/10"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/50 px-3 py-2 outline-none focus:ring-2 focus:ring-white/10"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15 transition disabled:opacity-50" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
      <p className="text-sm text-neutral-400 mt-4">
        No account? <a className="underline" href="/register">Create one</a>
      </p>
    </div>
  );
}
