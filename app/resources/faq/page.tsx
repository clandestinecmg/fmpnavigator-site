// app/resources/faq/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FMP FAQ: Claims, Pre-authorization, Emergencies | FMP Navigator",
  description:
    "Common questions about VA Foreign Medical Program (FMP) claims, pre-authorization, emergencies, documentation, and contacts.",
  alternates: { canonical: "/resources/faq" },
};

function QA({
  q,
  children,
}: {
  q: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-lg border border-(--border) bg-(--card) p-4 open:shadow-sm">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
        <h3 className="font-semibold text-(--ink)">{q}</h3>
        <span
          aria-hidden
          className="rounded-md border border-(--border) px-2 py-0.5 text-xs text-(--muted)"
        >
          Toggle
        </span>
      </summary>
      <div className="mt-3 space-y-3 text-(--text)">{children}</div>
    </details>
  );
}

export default function FaqPage() {
  return (
    <main className="container py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="h1">FAQ</h1>
        <p className="muted text-lg">
          Common questions about claims, pre-authorization, and emergencies for the
          VA Foreign Medical Program (FMP).
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/providers" className="btn btn-primary no-underline">
            Find direct-billing providers
          </Link>
          <Link href="/resources/getting-started" className="btn btn-secondary no-underline">
            Getting Started Guide
          </Link>
        </div>
      </header>

      {/* Claims */}
      <section className="space-y-4">
        <h2 className="h2">Claims</h2>

        <QA q="What do I submit with a reimbursement claim?">
          <ul className="list-disc pl-5">
            <li>VA Form 10-7959f-2 (FMP Claim Cover Sheet).</li>
            <li>Itemized bill (provider’s name, address, phone, services, dates, charges).</li>
            <li>Proof of payment (receipt, bank/credit statement showing provider name and date).</li>
            <li>Diagnosis and supporting medical documentation (visit notes, discharge summary).</li>
            <li>Prescription details if applicable (name, strength, quantity, directions).</li>
          </ul>
          <p className="small muted">
            Mail, fax, or email to FMP as listed in our{" "}
            <Link href="/resources/getting-started" className="underline underline-offset-4">
              Getting Started Guide
            </Link>
            .
          </p>
        </QA>

        <QA q="How long do I have to file a claim?">
          <p>
            Claims generally must be filed within <strong>2 years</strong> from the date of service.
            Sooner is better to avoid documentation gaps or translation delays.
          </p>
        </QA>

        <QA q="How does currency conversion work?">
          <p>
            Reimbursements are paid in U.S. dollars. When you pay abroad, VA typically converts at the{" "}
            <em>date-of-service</em> rate. Keep receipts that clearly show dates and amounts.
          </p>
        </QA>

        <QA q="Where do I send claims?">
          <pre className="small whitespace-pre-wrap rounded bg-(--muted)/10 p-3">
{`VHA Office of Community Care
Foreign Medical Program (FMP)
PO Box 469061
Denver, CO 80246-9061  USA
Fax: 1-303-331-7803
Phone: 1-303-331-7590
Email: HAC.FMP@VA.gov`}
          </pre>
        </QA>
      </section>

      {/* Pre-Authorization */}
      <section className="space-y-4">
        <h2 className="h2">Pre-authorization</h2>

        <QA q="Do I need pre-authorization for treatment?">
          <p>
            In many routine cases related to a covered service-connected condition, formal
            pre-authorization is <em>not</em> required. However, some services, settings, or
            high-cost items may be excluded or limited. If you’re unsure, contact FMP before care
            to confirm coverage and documentation expectations.
          </p>
          <p className="small">
            Email:{" "}
            <a className="underline underline-offset-4" href="mailto:HAC.FMP@va.gov">
              HAC.FMP@va.gov
            </a>{" "}
            · Phone (U.S.):{" "}
            <a className="underline underline-offset-4" href="tel:+18773458179">
              833-930-0816
            </a>
          </p>
        </QA>

        <QA q="What about medical equipment, home health, or long-term care?">
          <p>
            FMP covers items and services medically necessary to treat the service-connected
            condition, but <strong>long-term care</strong> (e.g., nursing homes, assisted living)
            and <strong>non-medical home care</strong> are not covered. For equipment, basic
            medically necessary items may be eligible; luxury or upgraded features are not.
            When in doubt, ask FMP in advance with a quote and clinical justification.
          </p>
        </QA>
      </section>

      {/* Emergencies */}
      <section className="space-y-4">
        <h2 className="h2">Emergencies</h2>

        <QA q="What should I do in an emergency overseas?">
          <p>
            Get care immediately at the nearest facility. After you’re stable, contact the facility’s
            insurance/HMO desk to determine if they can <strong>bill FMP directly</strong> for your
            service-connected condition. If not, pay the bill and submit a claim with itemized
            documentation.
          </p>
          <p>
            For ongoing mental health crisis support, contact the{" "}
            <Link href="/vcl" className="underline underline-offset-4">
              Veterans Crisis Line (VCL)
            </Link>{" "}
            via local options listed on our site.
          </p>
        </QA>

        <QA q="Will FMP cover emergency care that isn’t related to my service-connected condition?">
          <p>
            FMP is limited to covered service-connected conditions or those that aggravate them.
            Non-service-connected emergencies are generally not covered under FMP.
          </p>
        </QA>
      </section>

      {/* Providers & Billing */}
      <section className="space-y-4">
        <h2 className="h2">Providers &amp; Billing</h2>

        <QA q="How do I find a direct-billing facility?">
          <p>
            Use our{" "}
            <Link href="/providers" className="underline underline-offset-4">
              Providers page
            </Link>{" "}
            to see vetted facilities and maps in Thailand and the Philippines. Always confirm at the
            hospital’s HMO/insurance desk that they can bill FMP directly for your condition.
          </p>
        </QA>

        <QA q="What documentation should I bring to register at a hospital?">
          <ul className="list-disc pl-5">
            <li>Your FMP Benefits Authorization Letter.</li>
            <li>Valid ID (military/VA ID or passport are commonly accepted).</li>
            <li>
              Any VA.gov documentation that links your visit to a covered condition (helpful for
              smooth intake).
            </li>
          </ul>
        </QA>
      </section>

      {/* Documentation & Translations */}
      <section className="space-y-4">
        <h2 className="h2">Documentation &amp; Translations</h2>

        <QA q="Do my records need to be in English?">
          <p>
            Yes—non-English bills/records usually require translation and can delay processing.
            Ask providers upfront for <strong>itemized English bills</strong> and clearly stated
            diagnoses and dates of service.
          </p>
        </QA>

        <QA q="What if the provider uses bundled or generic receipts?">
          <p>
            Request an <strong>itemized invoice</strong> with clinic/hospital header, address, phone,
            each service listed with date, quantity, and charge, and attending provider information.
          </p>
        </QA>
      </section>

      {/* Prescriptions */}
      <section className="space-y-4">
        <h2 className="h2">Prescriptions</h2>

        <QA q="Are prescriptions covered?">
          <p>
            Medicines prescribed for a covered service-connected condition may be eligible. Drugs
            should be <strong>FDA-approved</strong> equivalents. Keep the prescription label or a
            pharmacy printout with drug name, strength, quantity, instructions, and prescribing provider.
          </p>
        </QA>
      </section>

      {/* Moves, Banking, Contact */}
      <section className="space-y-4">
        <h2 className="h2">Moves, Banking &amp; Contact</h2>

        <QA q="How do I update my address or bank info?">
          <p>
            Notify FMP as soon as anything changes (especially if you live abroad). Keeping contact
            and banking current avoids delays on decisions and payments.
          </p>
          <p className="small">
            Email:{" "}
            <a className="underline underline-offset-4" href="mailto:HAC.FMP@va.gov">
              HAC.FMP@va.gov
            </a>{" "}
            · Fax:{" "}
            <a className="underline underline-offset-4" href="tel:+13033317803">
              1-303-331-7803
            </a>
          </p>
        </QA>

        <QA q="How can I talk to someone at FMP?">
          <ul className="list-disc pl-5">
            <li>
              Email:{" "}
              <a className="underline underline-offset-4" href="mailto:HAC.FMP@va.gov">
                HAC.FMP@va.gov
              </a>
            </li>
            <li>
              Phone (U.S.):{" "}
              <a className="underline underline-offset-4" href="tel:+18773458179">
                833-930-0816
              </a>
            </li>
            <li>
              International toll-free: Australia 1-800-354-965 · Germany 0800-1800-011 · Italy 800-782-655 ·
              Japan 00531-13-0871
            </li>
            <li>
              Official site:{" "}
              <a
                className="underline underline-offset-4"
                href="https://www.va.gov/health-care/foreign-medical-program/"
                target="_blank"
                rel="noopener noreferrer"
              >
                va.gov/health-care/foreign-medical-program
              </a>
            </li>
          </ul>
        </QA>
      </section>

      {/* Friendly footer actions */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Link href="/resources/getting-started" className="btn btn-secondary no-underline">
          Read the Getting Started Guide
        </Link>
        <Link href="/providers" className="btn btn-primary no-underline">
          Browse Providers
        </Link>
      </div>
    </main>
  );
}