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
      className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15 transition disabled:opacity-50"
      disabled={pending}
    >
      {pending ? 'Logging out…' : 'Logout'}
    </button>
  );
}
