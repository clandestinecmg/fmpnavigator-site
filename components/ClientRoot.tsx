// components/ClientRoot.tsx
'use client';

import type { ReactNode } from 'react';
import AuthProvider from '@/components/AuthProvider';

export default function ClientRoot({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}