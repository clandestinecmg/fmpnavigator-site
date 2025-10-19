// components/Header.tsx
import Link from 'next/link';
import NavLink from './NavLink';

export default function Header() {
  return (
    <header
      role="banner"
      className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/20"
    >
      <div className="container py-4 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <span className="h-9 w-9 rounded-full bg-[var(--gold)] grid place-items-center shadow-md glow">
            <img src="/favicon.ico" alt="Compass" className="h-5 w-5" />
          </span>
          <span className="font-semibold tracking-tight group-hover:opacity-90 transition">
            FMP Navigator
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-6 text-sm text-[#cfd8e6]"
        >
          <NavLink href="/about">About</NavLink>
          <NavLink href="/app">The App</NavLink>
          <NavLink href="/advocacy">Advocacy</NavLink>
          <NavLink href="/resources">Resources</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/contact" className="btn btn-ghost">
            Get Updates
          </Link>
          <Link href="/contact" className="btn btn-primary elevate">
            Join Waitlist
          </Link>
        </div>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
    </header>
  );
}