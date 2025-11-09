// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  exact?: boolean;
  devOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", exact: true },
  { label: "About", href: "/about" },
  { label: "VCL Support", href: "/vcl" },
  { label: "App", href: "/app" },
  { label: "Providers", href: "/providers" },
  { label: "Resources", href: "/resources" },
  { label: "Advocacy", href: "/advocacy" },
  { label: "Updates", href: "/updates" },
  { label: "Contact", href: "/contact" },
  { label: "Testers", href: "/testers" },
  { label: "Sign in", href: "/signin" },
];

function isItemActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  if (item.href === "/updates") {
    return pathname === "/updates" || pathname.startsWith("/updates/");
  }
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export default function Header() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  const isDev =
    process.env.NODE_ENV !== "production" ||
    (typeof window !== "undefined" && window.location.hostname === "localhost");

  // Defer close on route change
  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // Close on Escape when menu is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const items = NAV_ITEMS.filter((i) => (i.devOnly ? isDev : true));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-(--border) bg-(--background)/90 backdrop-blur supports-backdrop-filter:backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          aria-label="FMP Navigator home"
          className="flex items-center gap-2.5"
        >
          <span className="font-extrabold tracking-tight text-2xl md:text-3xl text-(--ink)">
            FMP <span className="text-(--crimson)">Navigator</span>
          </span>
        </Link>

        {/* Desktop nav (no underlines) */}
        <nav
          className="hidden md:flex items-center gap-4"
          role="navigation"
          aria-label="Primary"
        >
          {items.map((item) => {
            const active = isItemActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "rounded px-2 py-1 text-sm transition-colors",
                  active
                    ? "font-semibold text-(--ink)"
                    : "text-(--muted) hover:text-(--ink)",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded border border-(--border)"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation"
        >
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <nav
          id="mobile-nav"
          className="md:hidden border-t border-(--border) bg-(--background)"
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
                    aria-current={active ? "page" : undefined}
                    className={[
                      "block rounded px-2 py-2 text-base",
                      active
                        ? "font-semibold text-(--ink)"
                        : "text-(--muted) hover:text-(--ink)",
                    ].join(" ")}
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