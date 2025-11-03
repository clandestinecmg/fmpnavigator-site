// components/Footer.tsx
/**
 * Dark, trustworthy footer per design directives:
 * - Navy background, white text
 * - Crisp divider (subtle)
 * - Accessible focus styles
 * - Small flag-emblem mark (inline SVG) at left
 */
type FooterProps = { year?: number };

export default function Footer({
  year = new Date().getFullYear(),
}: FooterProps) {
  return (
    <footer
      role="contentinfo"
      className="mt-16 text-white"
      style={{
        background: "var(--navy)",
        borderTop: "1px solid var(--navy-600)",
      }}
    >
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 py-8">
        {/* Brand / emblem */}
        <div className="flex items-center gap-3">
          {/* Simple emblem (flag outline) */}
          <svg
            width="24"
            height="16"
            viewBox="0 0 24 16"
            aria-hidden="true"
            fill="none"
            className="shrink-0"
          >
            <rect
              x="0.75"
              y="0.75"
              width="22.5"
              height="14.5"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M1.5 4.5h21" stroke="currentColor" strokeWidth="1" />
            <path d="M1.5 8h21" stroke="currentColor" strokeWidth="1" />
            <path d="M1.5 11.5h21" stroke="currentColor" strokeWidth="1" />
          </svg>
          <span className="small text-white/90">
            © {year} FMP Navigator — Veteran-founded. All rights reserved.
          </span>
        </div>

        {/* Links */}
        <nav aria-label="Footer" className="flex items-center gap-4">
          <a
            href="/privacy"
            className="small underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded px-1"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="small underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded px-1"
          >
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
}
