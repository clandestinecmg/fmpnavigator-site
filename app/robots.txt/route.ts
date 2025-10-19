// app/robots.txt/route.ts
export function GET() {
  return new Response(
`User-agent: *
Allow: /

Sitemap: https://fmpnavigator.org/sitemap.xml
`, { headers: { "Content-Type": "text/plain" } }
  );
}