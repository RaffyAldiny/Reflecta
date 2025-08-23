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
      await authApi.register(username.trim(), email.trim(), password); // sets cookies
      // sanity check & refresh
      try { await authApi.me(); } catch { /* ignore */ }
      router.replace('/');
      router.refresh();
    } catch (err: any) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Network error. Is the backend running on 127.0.0.1:8000?');
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-sm">
      <h1 className="text-2xl font-semibold mb-4 tracking-tight">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/50 px-3 py-2 outline-none focus:ring-2 focus:ring-white/10"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/50 px-3 py-2 outline-none focus:ring-2 focus:ring-white/10"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/50 px-3 py-2 outline-none focus:ring-2 focus:ring-white/10"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15 transition disabled:opacity-50" disabled={loading}>
          {loading ? 'Creating…' : 'Register'}
        </button>
      </form>
      <p className="text-sm text-neutral-400 mt-4">
        Already have an account? <a className="underline" href="/login">Login</a>
      </p>
    </div>
  );
}
