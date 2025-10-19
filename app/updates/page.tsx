// app/updates/page.tsx
type Post = { slug: string; title: string; date: string; summary: string };
const posts: Post[] = [
  {
    slug: "welcome",
    title: "Welcome to FMP Navigator",
    date: "2025-10-18",
    summary: "What we’re building for U.S. Veterans overseas and how to get involved.",
  },
  {
    slug: "provider-discovery",
    title: "Direct-billing hospital discovery efforts",
    date: "2025-10-18",
    summary: "How we’re mapping direct-billing facilities across SEA and validating entries.",
  },
];

export default function Updates() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="h2">Updates</h1>
      <p className="mt-2 muted">News and progress on providers, policy, and the app.</p>
      <div className="mt-8 grid gap-4">
        {posts.map((p) => (
          <a key={p.slug} href={`/updates/${p.slug}`} className="card hover:border-[var(--blue)]/60 transition">
            <div className="small">{new Date(p.date).toLocaleDateString()}</div>
            <h3 className="font-semibold mt-1">{p.title}</h3>
            <p className="mt-1 text-sm text-[#9fb0cc]">{p.summary}</p>
          </a>
        ))}
      </div>
    </div>
  );
}