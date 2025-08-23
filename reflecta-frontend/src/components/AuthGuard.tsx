'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, AuthError } from '@/lib/api';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    authApi.me()
      .then(() => !cancelled && setOk(true))
      .catch((err) => {
        if (err instanceof AuthError) router.replace('/login');
      });
    return () => { cancelled = true; };
  }, [router]);

  if (!ok) return null; // or a spinner
  return <>{children}</>;
}
