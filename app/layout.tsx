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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] antialiased">
        {/* Accessibility: skip to content */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus-ring absolute left-2 top-2 z-[100] rounded bg-[var(--card)] px-3 py-2"
        >
          Skip to content
        </a>

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
      </body>
    </html>
  );
}