// app/resources/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources | FMP Navigator",
  description:
    "Guides, FAQs, forms, and contacts to help U.S. veterans use the VA Foreign Medical Program (FMP) overseas.",
  alternates: { canonical: "/resources" },
};

type Tile = {
  title: string;
  desc: string;
  href: string;
  cta?: string;
};

const tiles: Tile[] = [
  {
    title: "Getting Started Guide",
    desc:
      "Eligibility, registration, claims, and contacts in a clean, step-by-step format.",
    href: "/resources/getting-started",
    cta: "Open guide",
  },
  {
    title: "FAQ",
    desc:
      "Common questions about claims, pre-authorization, prescriptions, and emergencies.",
    href: "/resources/faq",
    cta: "Read FAQ",
  },
  {
    title: "Forms & How-tos",
    desc:
      "Direct links to FMP registration and claim cover sheet with submission details.",
    href: "https://www.va.gov/health-care/foreign-medical-program/",
    cta: "VA FMP page",
  },
  {
    title: "Contact FMP",
    desc:
      "Email, phone, fax, and international toll-free numbers to reach the FMP team.",
    href: "/resources/getting-started#contacts",
    cta: "See contacts",
  },
  {
    title: "Direct-Billing Providers",
    desc:
      "Hospitals and clinics that can bill FMP directly for covered conditions.",
    href: "/providers",
    cta: "Browse providers",
  },
  {
    title: "Veterans Crisis Support",
    desc:
      "Call, chat, or text the Veterans Crisis Line with overseas options.",
    href: "/vcl",
    cta: "Open VCL",
  },
];

export default function ResourcesPage() {
  return (
    <main className="container py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="h1">Resources</h1>
        <p className="muted text-lg">
          Trusted guides, FAQs, and official links for navigating the VA Foreign Medical Program (FMP) overseas.
        </p>
      </header>

      <section aria-label="Resource tiles" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <article key={t.title} className="card p-5 flex flex-col justify-between">
            <div>
              <h2 className="h4">{t.title}</h2>
              <p className="small muted mt-1">{t.desc}</p>
            </div>
            <div className="mt-4">
              {/* Internal routes use Link; external keeps <a> with target */}
              {t.href.startsWith("/") ? (
                <Link href={t.href} className="btn btn-primary no-underline">
                  {t.cta ?? "Open"}
                </Link>
              ) : (
                <a
                  href={t.href}
                  className="btn btn-primary no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.cta ?? "Open"}
                </a>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}