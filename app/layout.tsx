// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "FMP Navigator",
  description: "Helping U.S. Veterans Overseas navigate the VA Foreign Medical Program",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Header / Nav */}
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <a href="/" className="group flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[var(--gold)] grid place-items-center shadow-md glow">
                <img src="/favicon.ico" alt="Compass" className="h-5 w-5" />
              </div>
              <span className="font-semibold tracking-tight group-hover:opacity-90 transition">
                FMP Navigator
              </span>
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm text-[#cfd8e6]">
              <a href="/about" className="hover:text-white">About</a>
              <a href="/app" className="hover:text-white">The App</a>
              <a href="/advocacy" className="hover:text-white">Advocacy</a>
              <a href="/resources" className="hover:text-white">Resources</a>
              <a href="/contact" className="hover:text-white">Contact</a>
            </nav>
            <div className="flex items-center gap-3">
              <a href="/contact" className="btn btn-ghost">Get Updates</a>
              <a href="/contact" className="btn btn-primary elevate">Join Waitlist</a>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
        </header>

        {/* Status bar */}
        <div className="w-full bg-[#14213a] border-b border-[var(--border)] text-center py-2 px-4 small">
          <strong>Status:</strong> Public site is live. The mobile app is currently under repair—join the waitlist for updates.
        </div>

        {/* Page content */}
        <main className="min-h-[70vh]">{children}</main>

        {/* Footer */}
        <footer className="border-t border-[var(--border)] py-8 mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 small">
            <div>© {new Date().getFullYear()} FMP Navigator — Veteran-founded. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="hover:text-white">Privacy</a>
              <a href="/terms" className="hover:text-white">Terms</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}