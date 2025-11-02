// app/testers/page.tsx
'use client';

import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function TestersPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="container py-8">
        <div className="card">Loading…</div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="container py-8">
        <div className="card space-y-2">
          <h1 className="h2">Testers</h1>
          <p className="muted">Please sign in to access the testers’ area.</p>
          {/* ✅ Route groups are ignored in URLs — use /signin */}
          <Link href="/signin" className="btn btn-primary w-fit">Sign in</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-8 space-y-4">
      <h1 className="h1">Tester Dashboard</h1>
      <div className="card">
        <p>Welcome, <strong>{user.email}</strong>!</p>
        <p className="small">We’ll add metrics and forum links here.</p>
      </div>
    </section>
  );
}