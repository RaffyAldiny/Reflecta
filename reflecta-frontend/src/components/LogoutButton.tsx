'use client';

import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handle() {
    setPending(true);
    try { await authApi.logout(); }
    finally { setPending(false); router.replace('/login'); router.refresh(); }
  }

  return (
    <button
      onClick={handle}
      className="rounded-xl bg-gradient-to-r from-violet-600/30 to-cyan-500/30 px-4 py-2 hover:from-violet-500/40 hover:to-cyan-400/40 transition disabled:opacity-50 border border-white/10"
      disabled={pending}
    >
      {pending ? 'Logging out…' : 'Logout'}
    </button>
  );
}
