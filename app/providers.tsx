'use client';

import { ReactNode } from 'react';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';

export function Providers({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return <>{children}</>;
}
