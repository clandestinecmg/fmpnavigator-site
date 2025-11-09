// app/sitemap.ts
import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fmpnavigator.org";

// Keep this list in sync with public pages (add new routes here)
const routes: string[] = [
  "",                // homepage
  "/about",
  "/app",
  "/providers",
  "/resources",
  "/advocacy",
  "/updates",
  "/updates/provider-discovery",
  "/updates/welcome",
  "/contact",
  "/privacy",
  "/terms",
  "/signin",
  "/testers",
  "/vcl",            // your new Veterans Crisis Support page
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));
}