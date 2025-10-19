// components/Footer.tsx
type FooterProps = { year?: number };

export default function Footer({ year = new Date().getFullYear() }: FooterProps) {
  return (
    <footer role="contentinfo" className="border-t border-[var(--border)] py-8 mt-16">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-3 small">
        <div>© {year} FMP Navigator — Veteran-founded. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <a href="/privacy" className="hover:text-white">Privacy</a>
          <a href="/terms" className="hover:text-white">Terms</a>
        </div>
      </div>
    </footer>
  );
}