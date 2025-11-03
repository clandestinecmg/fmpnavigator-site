// next.config.ts
import { withSentryConfig, type SentryBuildOptions } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Turbopack is enabled by the CLI flag; no `experimental.turbo` key here.
  experimental: {
    // Keep only keys that exist on ExperimentalConfig for Next 16
    serverComponentsExternalPackages: ["firebase-admin"],
    // If you previously relied on `esmExternals`, remove it; Next 16 handles this automatically.
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    domains: ["fmpnavigator.org"],
    formats: ["image/avif", "image/webp"],
  },
  env: {
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://fmpnavigator.org",
  },
};

// Build Sentry options while OMITTING authToken when it’s not set.
const sentryOptions: SentryBuildOptions = {
  org: "fmp-navigator",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  ...(process.env.SENTRY_AUTH_TOKEN
    ? { authToken: process.env.SENTRY_AUTH_TOKEN }
    : {}),
  // If you want to be explicit about sourcemaps later, use:
  // sourcemaps: { disable: false },
};

export default withSentryConfig(nextConfig, sentryOptions);