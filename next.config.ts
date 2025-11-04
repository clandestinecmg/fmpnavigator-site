// next.config.ts
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 15/16: use top-level serverExternalPackages instead of experimental.*
  serverExternalPackages: ["firebase-admin"],

  // Replace deprecated images.domains with remotePatterns
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      // add others you really use (CDNs, static hosts) to keep attack surface tight
    ],
  },

  // Leave off prod browser source maps unless you explicitly want them public
  productionBrowserSourceMaps: false,
};

export default withSentryConfig(nextConfig, {
  org: "fmp-navigator",
  project: "javascript-nextjs",
  // CI-only chatter
  silent: !process.env.CI,

  // Smaller bundles by stripping Sentry logger calls
  disableLogger: true,

  // Optional; enables Vercel cron monitor auto-instrumentation
  automaticVercelMonitors: true,

  // NOTE: don't pass authToken as undefined — omit entirely so types are happy.
  // If you set SENTRY_AUTH_TOKEN in env, the Sentry CLI will pick it up.
});