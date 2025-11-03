// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-2xl">
          <h1 className="h1">
            Helping U.S. Veterans Overseas navigate the{" "}
            <span className="text-(--crimson)">VA Foreign Medical Program</span>
          </h1>
          <p className="mt-5 muted md:text-lg">
            SEA-based, veteran-founded. We connect you to FMP providers,
            direct-billing hospitals, and crisis resources — so you can get the
            care you earned.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">
              Join the waitlist
            </Link>
            <Link href="/resources" className="btn btn-ghost">
              View resources
            </Link>
          </div>

          <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 small">
            <li className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-(--crimson)" />{" "}
              SEA-based
            </li>
            <li className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-(--navy)" />{" "}
              Veteran-founded
            </li>
            <li className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-(--gold)" />{" "}
              Nonprofit-leaning mission
            </li>
          </ul>
        </div>

        {/* Feature grid */}
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
              body: "What to prepare, how to file, and common pitfalls to avoid — no fluff.",
            },
            {
              title: "Crisis Resources",
              body: "Emergency numbers, VA hotlines, embassy contacts, and veteran peer support.",
            },
            {
              title: "Advocacy & Transparency",
              body: "Data, FOIA efforts, and briefings to improve outcomes for vets abroad.",
            },
            {
              title: "Community & Updates",
              body: "Sign up for provider additions, policy changes, and regional alerts.",
            },
          ].map((x, i) => (
            <article key={i} className="card transition hover:shadow-lg">
              <h3 className="font-semibold">{x.title}</h3>
<p className="mt-1 text-sm text-(--muted-2)">{x.body}</p>
            </article>
          ))}
        </div>

        {/* CTA block */}
        <div className="mt-16 card flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="h2">Ready to help — join the waitlist</h2>
            <p className="mt-1 small">
              We’ll notify you when the mobile app is ready and share new
              provider data.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/contact" className="btn btn-primary">
              Join waitlist
            </Link>
            <Link href="/resources" className="btn btn-ghost">
              Explore resources
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
