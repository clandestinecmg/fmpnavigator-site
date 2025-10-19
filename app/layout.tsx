// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'FMP Navigator',
    template: '%s · FMP Navigator',
  },
  description:
    'Helping U.S. Veterans Overseas navigate the VA Foreign Medical Program.',
  metadataBase: new URL('https://fmpnavigator.org'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'FMP Navigator',
    description:
      'Helping U.S. Veterans Overseas navigate the VA Foreign Medical Program.',
    url: 'https://fmpnavigator.org',
    siteName: 'FMP Navigator',
    type: 'website',
  },
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  themeColor: '#0a1426',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const year = new Date().getFullYear();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Skip link for keyboard/screen readers */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus-ring absolute left-2 top-2 z-[100] rounded bg-[var(--card)] px-3 py-2"
        >
          Skip to content
        </a>

        <Header />

        {/* Status bar */}
        <div
          role="status"
          className="w-full bg-[#14213a] border-b border-[var(--border)] text-center py-2 px-4 small"
        >
          <strong>Status:</strong>{' '}
          Public site is live. The mobile app is currently under repair—join the
          waitlist for updates.
        </div>

        {/* Page content */}
        <main id="main" role="main" className="min-h-[70vh]">
          {children}
        </main>

        <Footer year={year} />
      </body>
    </html>
  );
}