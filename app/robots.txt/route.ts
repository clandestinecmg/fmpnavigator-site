// app/robots.txt/route.ts
export function GET() {
  // Use your public site URL if defined, otherwise default to production domain
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fmpnavigator.org";

  // Point Sitemap to the new app/sitemap.ts route (no longer /sitemap.xml)
  return new Response(
`User-agent: *
Allow: /

Sitemap: ${base}/sitemap
`,
    { headers: { "Content-Type": "text/plain" } },
  );
}