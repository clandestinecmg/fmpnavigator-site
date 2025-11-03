// app/advocacy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Advocacy & Transparency | FMP Navigator",
  description:
    "Data, FOIA efforts, and partner briefings to improve outcomes for U.S. veterans living abroad.",
  alternates: { canonical: "/advocacy" },
};

export default function AdvocacyPage() {
  return (
    <section className="container py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="h1">Advocacy &amp; Transparency</h1>
        <p className="muted text-lg">
          Data, FOIA efforts, and partner briefings to improve outcomes for vets
          abroad.
        </p>
      </header>

      {/* Snapshot cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <h2 className="h4 mb-1">FOIA Tracker</h2>
          <p className="small muted">
            Status of requests, responses, and “no record” letters.
          </p>
          <div className="mt-3">
            <Link href="#foia" className="btn btn-secondary">
              View log
            </Link>
          </div>
        </div>
        <div className="card p-5">
          <h2 className="h4 mb-1">Data Snapshots</h2>
          <p className="small muted">
            Aggregated public metrics (claims, processing times, networks).
          </p>
          <div className="mt-3">
            <Link href="#data" className="btn btn-secondary">
              See data
            </Link>
          </div>
        </div>
        <div className="card p-5">
          <h2 className="h4 mb-1">Partner Briefings</h2>
          <p className="small muted">
            Slide decks and one-pagers used with providers and stakeholders.
          </p>
          <div className="mt-3">
            <Link href="#briefings" className="btn btn-secondary">
              Browse
            </Link>
          </div>
        </div>
      </div>

      {/* FOIA log */}
      <section id="foia" className="space-y-3">
        <h2 className="h2">FOIA Requests</h2>
        <p className="muted">
          We publish request subjects, agencies, dates, and outcomes for
          accountability.
        </p>
        <div className="card overflow-x-auto">
          <table className="w-full small">
            <thead>
              <tr className="text-left">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Agency</th>
                <th className="py-2 px-3">Subject</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Docs</th>
              </tr>
            </thead>
            <tbody>
              {/* TODO: Replace rows with dynamic content later */}
              <tr className="border-t border-(--border)">
                <td className="py-2 px-3">—</td>
                <td className="py-2 px-3">—</td>
                <td className="py-2 px-3">—</td>
                <td className="py-2 px-3">—</td>
                <td className="py-2 px-3">
                  <span className="muted">None yet</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Data snapshots */}
      <section id="data" className="space-y-3">
        <h2 className="h2">Data Snapshots</h2>
        <p className="muted">
          Non-PII, public metrics that help illustrate needs and opportunities
          overseas.
        </p>
        <div className="card p-5 space-y-2">
          <ul className="list-disc pl-5 small">
            <li>Claim volumes and trends (public reports)</li>
            <li>Direct-billing footprint by country/region</li>
            <li>Typical travel burden to reach providers</li>
          </ul>
          <p className="small muted">
            TODO: Wire this to a JSON/CSV feed or Firestore collection when
            ready.
          </p>
        </div>
      </section>

      {/* Briefings */}
      <section id="briefings" className="space-y-3">
        <h2 className="h2">Partner Briefings</h2>
        <p className="muted">
          Outreach decks and one-pagers used with hospitals, VSOs, and agencies.
        </p>
        <div className="card p-5 space-y-2">
          <ul className="list-disc pl-5 small">
            <li>Intro deck (providers)</li>
            <li>Program overview (VSOs)</li>
            <li>Data brief (policy stakeholders)</li>
          </ul>
          <p className="small">
            Need to share materials? Email us at{" "}
            <a
              className="link-underline"
              href="mailto:support@fmpnavigator.org"
            >
              support@fmpnavigator.org
            </a>
            .
          </p>
        </div>
      </section>

      {/* Contribute */}
      <section className="space-y-3">
        <h2 className="h2">Contribute or Verify</h2>
        <div className="card p-5 space-y-2">
          <p className="small">
            If you have public data or documents we should review, please send
            them via the{" "}
            <Link href="/contact" className="link-underline">
              contact form
            </Link>{" "}
            or email.
          </p>
          <p className="small muted">
            We never publish sensitive personal information. All posted docs are
            reviewed and redacted if needed.
          </p>
        </div>
      </section>
    </section>
  );
}
