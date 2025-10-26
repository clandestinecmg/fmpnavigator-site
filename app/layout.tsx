// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientRoot from '@/components/ClientRoot';

export const metadata: Metadata = {
  title: 'FMP Navigator',
  description:
    'Helping U.S. Veterans overseas navigate the VA Foreign Medical Program.',
  applicationName: 'FMP Navigator',
  authors: [{ name: 'FMP Navigator Project' }],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#14213a',
};

// Always-visible Under Construction banner (no client-only APIs used)
function UnderConstructionBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-400 text-black text-center py-3 px-4 shadow-md border-b border-yellow-600">
      🚧 <span className="font-semibold">FMP Navigator Website Under Construction</span> — some pages and forms may be temporarily unavailable while we finalize the build.
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] antialiased">
        {/* Accessibility: skip to content */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus-ring absolute left-2 top-2 z-[101] rounded bg-[var(--card)] px-3 py-2"
        >
          Skip to content
        </a>

        {/* Always-visible site-wide notice */}
        <UnderConstructionBanner />

        {/* Add top padding so the fixed banner doesn't overlap header/content */}
        <div className="pt-16">
          {/* Global client-side context/providers (Auth, etc.) */}
          <ClientRoot>
            <Header />

            <main
              id="main"
              role="main"
              className="container mx-auto px-4 py-6"
            >
              {children}
            </main>

            <Footer year={year} />
          </ClientRoot>
        </div>
      </body>
    </html>
  );
}