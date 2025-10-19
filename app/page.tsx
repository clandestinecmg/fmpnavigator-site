// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft animated background */}
      <div className="absolute inset-0 hero-bg opacity-80" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
        <div className="max-w-2xl fade-in">
          <h1 className="h1">
            Helping U.S. Veterans Overseas navigate the{" "}
            <span className="text-[var(--gold)]">VA Foreign Medical Program</span>
          </h1>
          <p className="mt-5 muted md:text-lg">
            SEA-based, veteran-founded. We connect you to FMP providers, direct-billing hospitals, and crisis
            resources—so you can get the care you earned.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary elevate">Join the Waitlist</Link>
            <Link href="/resources" className="btn btn-ghost">View Resources</Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 small">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue)]" /> SEA-based
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue)]" /> Veteran-founded
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue)]" /> Nonprofit-leaning mission
            </span>
          </div>
        </div>

        {/* Feature / value grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Find FMP Providers",
              body: "Country-by-country guidance to locate clinics and hospitals that understand FMP billing.",
            },
            {
              title: "Direct-Billing Hospitals",
              body: "Where possible, avoid pay-out-of-pocket by using trusted direct-billing facilities.",
            },
            {
              title: "Claims & Checklists",
              body: "What to prepare, how to file, and common pitfalls to avoid—no fluff.",
            },
            {
              title: "Crisis Resources",
              body: "Emergency numbers, VA hotlines, embassy contacts, and veteran peer support.",
            },
            {
              title: "Advocacy & Transparency",
              body: "Data, FOIA efforts, and partner briefings to improve outcomes for vets abroad.",
            },
            {
              title: "Community & Updates",
              body: "Sign up for verified provider additions, policy changes, and regional alerts.",
            },
          ].map((x, i) => (
            <article key={i} className="card hover:border-[var(--blue)]/60 transition fade-in">
              <h3 className="font-semibold">{x.title}</h3>
              <p className="mt-1 text-sm text-[#9fb0cc]">{x.body}</p>
            </article>
          ))}
        </div>

        {/* CTA bar */}
        <div className="mt-16 card flex items-center justify-between gap-4 flex-col md:flex-row">
          <div>
            <h2 className="h2">Ready to help—join the waitlist</h2>
            <p className="mt-1 small">We’ll notify you when the mobile app is ready and share new provider data.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/contact" className="btn btn-primary elevate">Join Waitlist</Link>
            <Link href="/advocacy" className="btn btn-ghost">Partner with Us</Link>
          </div>
        </div>
      </div>
    </section>
  );
}