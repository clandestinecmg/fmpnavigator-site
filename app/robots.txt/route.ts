// app/robots.txt/route.ts
export function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fmpnavigator.org";
  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`,
    { headers: { "Content-Type": "text/plain" } },
  );
}
