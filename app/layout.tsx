// app/layout.tsx
import Providers from "@/components/Providers";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UnderConstructionBanner from "@/components/UnderConstructionBanner";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fmpnavigator.org";

// Fixed banner height (keep header = 4rem). Tweak here if you adjust banner padding.
const BANNER_REM = 3; // ~48px

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FMP Navigator",
    template: "%s • FMP Navigator",
  },
  description:
    "Helping U.S. Veterans overseas navigate the VA Foreign Medical Program.",
  applicationName: "FMP Navigator",
  authors: [{ name: "FMP Navigator Project" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "FMP Navigator",
    title:
      "FMP Navigator — VA Foreign Medical Program support for vets overseas",
    description:
      "Find FMP-aware providers, direct-billing hospitals, crisis resources, and practical checklists.",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "FMP Navigator" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FMP Navigator",
    description:
      "Helping U.S. Veterans overseas navigate the VA Foreign Medical Program.",
    images: ["/og-image.png"],
  },
  category: "nonprofit",
  keywords: [
    "VA FMP",
    "Foreign Medical Program",
    "veterans overseas",
    "direct billing",
    "Thailand",
    "SEA",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A1B33", // --navy from globals.css
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Keep this as a normal React component (Server Component) that returns <html><body>…
  // No client-only code here.
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh bg-(--background) text-(--foreground) antialiased">
        {/* A11y: skip link */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only rounded bg-(--card) px-3 py-2"
          style={{
            position: "absolute",
            left: "0.5rem",
            top: "0.5rem",
            zIndex: 101,
          }}
        >
          Skip to content
        </a>

        {/* Site-wide banner (fixed) */}
        <UnderConstructionBanner />

        {/* Offset: header (4rem) + banner + safe-area */}
        <div
          style={{
            paddingTop: `calc(4rem + ${BANNER_REM}rem + env(safe-area-inset-top))`,
          }}
        >
          <Header />
          <main id="main" role="main" className="container mx-auto px-4 py-6">
            <Providers>{children}</Providers>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
