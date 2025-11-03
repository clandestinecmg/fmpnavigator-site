// components/ValueTiles.tsx
import Link from "next/link";

const items = [
  {
    title: "Providers",
    desc: "Direct-billing hospitals and clinics vetted by veterans.",
    href: "/providers",
  },
  {
    title: "Resources",
    desc: "Claim how-tos, FMP forms, contact info, crisis support.",
    href: "/resources",
  },
  {
    title: "Updates",
    desc: "Roadmap notes and transparency reports.",
    href: "/updates",
  },
  {
    title: "Contact",
    desc: "Questions? We reply quickly.",
    href: "/contact",
  },
];

export default function ValueTiles() {
  return (
    <section className="container py-10">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <Link
            key={it.title}
            href={it.href}
            className="card transition hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <h3 className="font-semibold">{it.title}</h3>
            <p className="muted mt-1">{it.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
