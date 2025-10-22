// components/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type NavItem = {
  label: string;
  href: string;
  /** When true, only exact pathname matches are considered active. */
  exact?: boolean;
  /** Hide in production (e.g., debug pages) */
  devOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', exact: true },
  { label: 'About', href: '/about' },
  { label: 'App', href: '/app' },
  { label: 'Providers', href: '/providers' },
  { label: 'Resources', href: '/resources' },
  { label: 'Testers', href: '/testers' },
  { label: 'Updates', href: '/updates' }, // also covers /updates/welcome
  { label: 'Contact', href: '/contact' },
  { label: 'Sign in', href: '/signin' },  // (auth)/signin is routed as /signin
  { label: 'Debug Env', href: '/_debug-env', devOnly: true }, // dev-only helper
];

function isItemActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  if (item.href === '/updates') {
    return pathname === '/updates' || pathname.startsWith('/updates/');
  }
  return pathname === item.href || pathname.startsWith(item.href + '/');
}

export default function Header() {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);

  // Dev-only items visible on localhost or non-production NODE_ENV
  const isDev =
    process.env.NODE_ENV !== 'production' ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost');

  // Close the mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape for accessibility
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const items = NAV_ITEMS.filter((i) => (i.devOnly ? isDev : true));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="FMP Navigator home"
        >
          FMP Navigator
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4" role="navigation" aria-label="Primary">
          {items.map((item) => {
            const active = isItemActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'rounded px-2 py-1 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  active
                    ? 'font-medium text-[var(--foreground)] underline underline-offset-4'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
                ].join(' ')}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded border border-[var(--border)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Menu</span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <nav
          id="mobile-nav"
          className="md:hidden border-t border-[var(--border)] bg-[var(--background)]"
          role="navigation"
          aria-label="Primary mobile"
        >
          <ul className="container py-2">
            {items.map((item) => {
              const active = isItemActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={[
                      'block rounded px-2 py-2 text-sm',
                      active
                        ? 'font-medium text-[var(--foreground)] underline underline-offset-4'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}