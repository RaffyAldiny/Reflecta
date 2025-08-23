'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi, ApiError, AuthError } from '@/lib/api';
import CosmicPanel from '@/components/CosmicPanel';

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
    <div className="min-h-screen md:min-h-0 md:grid md:grid-cols-2 gap-6 items-center p-4 md:p-0">
      {/* LEFT: form card */}
      <div className="w-full max-w-md mx-auto">
        <div className="relative overflow-hidden rounded-2xl border-2 border-violet-500/30 p-6 bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-lg">
          <div className="pointer-events-none absolute -top-20 -left-16 h-48 w-48 rounded-full bg-violet-600/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-16 h-48 w-48 rounded-full bg-cyan-600/40 blur-3xl" />
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-200 to-cyan-200 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-neutral-200 text-sm mt-2">Log in to continue your journey through memories.</p>

          <form onSubmit={onSubmit} className="space-y-5 mt-8">
            <div>
              <label className="block text-sm mb-2 text-neutral-200">Username or Email</label>
              <input
                className="w-full rounded-xl border-2 border-violet-500/20 bg-black/40 px-4 py-3 outline-none focus:border-violet-500/40 transition-colors text-white"
                value={identifier} 
                onChange={(e) => setIdentifier(e.target.value)} 
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-neutral-200">Password</label>
              <input
                className="w-full rounded-xl border-2 border-cyan-500/20 bg-black/40 px-4 py-3 outline-none focus:border-cyan-500/40 transition-colors text-white"
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-red-300 text-sm bg-red-500/20 p-2 rounded-lg">{error}</p>}

            <button
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3.5 border-2 border-white/20 hover:from-violet-500 hover:to-cyan-400 transition-all duration-300 disabled:opacity-50 font-semibold text-white shadow-lg hover:shadow-violet-500/30"
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>

          <p className="text-sm text-neutral-200 mt-6 text-center">
            No account?{' '}
            <a className="text-cyan-300 hover:text-cyan-200 underline transition-colors" href="/register">
              Create one
            </a>
          </p>
        </div>
      </div>

      {/* RIGHT: animated cosmic panel (hidden on small screens) */}
      <div className="hidden md:block mt-8 md:mt-0">
        <CosmicPanel />
      </div>
    </div>
  );
}