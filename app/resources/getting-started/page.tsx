// app/resources/getting-started/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Getting Started with the VA Foreign Medical Program (FMP) | FMP Navigator",
  description:
    "Step-by-step overview of FMP eligibility, registration, claims, and contacts for U.S. Veterans overseas.",
  alternates: { canonical: "/resources/getting-started" },
};

function Badge({ children }: { children: string | number }) {
  return (
    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-(--brand) px-2 text-xs font-bold text-white">
      {children}
    </span>
  );
}

function Card({
  id,
  badge,
  title,
  children,
}: {
  id: string;
  badge?: string | number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="card p-5 md:p-6 space-y-3 scroll-mt-24">
      <div className="flex items-start gap-3">
        {badge ? <Badge>{badge}</Badge> : null}
        {/* Upgrade section headers to look like strong block headers */}
        <h2 className="h2 m-0">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function GettingStartedPage() {
  return (
    <main className="container py-10">
      {/* Page header */}
      <header className="mb-8 space-y-2">
        <h1 className="h1">Getting Started with the VA Foreign Medical Program (FMP)</h1>
        <p className="muted text-lg">
          Your guide to eligibility, registration, claims, and official contacts — formatted
          for easy reading and navigation.
        </p>

        {/* Top quick actions */}
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/providers" className="btn btn-primary no-underline">
            Find direct-billing providers
          </Link>
          <a
            className="btn btn-secondary no-underline"
            href="https://www.va.gov/health-care/foreign-medical-program/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open official FMP page
          </a>
        </div>
      </header>

      {/* NEW page-wide section (before the two-column layout) */}
      <section
        id="covered-services"
        className="card p-6 md:p-8 space-y-4 mb-6"
      >
        <h2 className="h2">Care and services covered through FMP</h2>
        <p className="muted">
          The FMP covers care and services that are medically necessary to treat a service-connected disability. Below is a non-exhaustive list of the types of care and services covered by the FMP:
        </p>
        <ul className="list-disc pl-5">
          <li>Outpatient care</li>
          <li>Inpatient care</li>
          <li>Emergency and urgent care</li>
          <li>
            Medical equipment, devices, and supplies that your provider prescribes to support your everyday
            activities—including prosthetics
          </li>
          <li>
            Skilled nursing care (medical care by licensed providers to help with medicines, wound care, and
            other recovery and medical needs)
          </li>
          <li>Physical therapy</li>
          <li>Prescription medicines approved by the Food and Drug Administration (FDA)</li>
        </ul>

        <h3 className="font-bold text-(--ink) text-xl mt-4">
          Some things that are NOT covered by the FMP:
        </h3>
        <ul className="list-disc pl-5">
          <li>Care or services that aren’t related to your service-connected disability.</li>
          <li>
            Care that isn’t accepted by VA or the U.S. medical community (including experimental treatments and
            medicines that aren’t approved by the FDA)
          </li>
          <li>
            Long-term care in nursing homes, assisted living facilities, mental health facilities, or adult day
            health centers
          </li>
          <li>Non-medical home care or companion services</li>
          <li>
            Medical equipment with deluxe or luxury features (such as a queen- or king-sized bed, remote controls,
            or a stair-climbing wheelchair)
          </li>
          <li>Health club, spa, or exercise program memberships</li>
          <li>Family planning services and sterilization</li>
          <li>Gender-affirming care</li>
        </ul>

        <h3 className="font-bold text-(--ink) text-xl mt-4">
          They do not cover care and services received by the following methods:
        </h3>
        <ul className="list-disc pl-5">
          <li>Through a grant, study, or research program</li>
          <li>In a U.S. state or territory, the District of Columbia, or Puerto Rico</li>
          <li>In a country that doesn’t accept U.S. Treasury checks or doesn’t allow travel for U.S. citizens</li>
          <li>From a provider or facility barred from this program</li>
        </ul>

        <h3 className="font-bold text-(--ink) text-xl mt-4">
          The FMP also does not cover the following types of costs:
        </h3>
        <ul className="list-disc pl-5">
          <li>Travel costs</li>
          <li>Costs for paying bills (like postage, late charges, or check-cashing fees)</li>
          <li>Charges for services, treatments, or supplies that you don’t have to pay by law</li>
        </ul>
      </section>

      {/* Layout: sticky TOC + content */}
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
        {/* Sticky in-page nav */}
        <aside className="card p-4 md:sticky md:top-24 h-fit" aria-label="On this page">
          <h2 className="h5 mb-2">On this page</h2>
          <nav className="text-sm">
            <ol className="space-y-1">
              <li>
                <a className="underline-offset-4 hover:underline" href="#what-fmp-is">
                  1. What FMP is &amp; Who is eligible
                </a>
              </li>
              <li>
                <a className="underline-offset-4 hover:underline" href="#before-travel">
                  2. Before you travel or while you’re abroad
                </a>
              </li>
              <li>
                <a className="underline-offset-4 hover:underline" href="#register">
                  3. How to Register for the VA Foreign Medical Program
                </a>
              </li>
              <li>
                <a className="underline-offset-4 hover:underline" href="#finding-providers">
                  4. Finding and Choosing a Healthcare Facility Abroad
                </a>
              </li>
              <li>
                <a className="underline-offset-4 hover:underline" href="#claims">
                  5. How to File a Claim
                </a>
              </li>
              <li>
                <a className="underline-offset-4 hover:underline" href="#coverage">
                  6. What Benefits Are Covered &amp; Limitations
                </a>
              </li>
              <li>
                <a className="underline-offset-4 hover:underline" href="#contacts">
                  7. Contact &amp; Resources
                </a>
              </li>
              <li>
                <a className="underline-offset-4 hover:underline" href="#checklist">
                  8. Quick Step-by-Step Checklist
                </a>
              </li>
              <li>
                <a className="underline-offset-4 hover:underline" href="#links">
                  9. Key Links (Official)
                </a>
              </li>
              <li>
                <a className="underline-offset-4 hover:underline" href="#tips">
                  10. Tips for Overseas Veterans
                </a>
              </li>
            </ol>
          </nav>
        </aside>

        {/* Content column */}
        <div className="space-y-6">
          <Card id="what-fmp-is" badge="1" title="What FMP is & Who is eligible">
            <ul className="list-disc pl-5">
              <li>
                FMP covers medically-necessary services outside the U.S. for the Veteran’s VA-rated
                service-connected disability, or a condition associated with a service-connected disability
                (which “makes the disability worse”).
              </li>
              <li>It does not cover care in the U.S. or U.S. territories under this program.</li>
              <li>You do not have to be enrolled in VA health care in the U.S. to register for FMP.</li>
            </ul>
          </Card>

          <Card id="before-travel" badge="2" title="Before you travel or while you’re abroad">
            <ul className="list-disc pl-5">
              <li>
                Decide whether you will receive care abroad under FMP (direct-billing provider or you pay
                and submit claim later).
              </li>
              <li>Collect your VA claim number / VA file number / SSN (they are often the same).</li>
              <li>
                Ensure you have access to your primary U.S. mailing address (especially if living/traveling
                abroad) as the VA may need to mail the authorization letter.
              </li>
              <li>
                Make sure you have your bank account routing and account number if you want direct deposit
                of any claim payments and for international bank accounts the VA is transitioning to
                direct-deposit.
              </li>
            </ul>
          </Card>

          <Card id="register" badge="3" title="How to Register for the VA Foreign Medical Program">
            <p>There are four registration options:</p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-(--border) p-4">
                <h3 className="font-semibold">Online</h3>
                <ul className="list-disc pl-5 mt-2">
                  <li>
                    Visit the VA’s FMP page:&nbsp;
                    <a
                      href="https://www.va.gov/health-care/foreign-medical-program/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4"
                    >
                      va.gov/health-care/foreign-medical-program
                    </a>
                  </li>
                  <li>The form is: VA Form 10-7959f-1 (FMP Registration Form)</li>
                </ul>
              </div>

              <div className="rounded-lg border border-(--border) p-4">
                <h3 className="font-semibold">By Email</h3>
                <p className="mt-2">
                  Download and complete VA Form 10-7959f-1 (FMP Registration Form) and email it to{" "}
                  <a href="mailto:HAC.FMP@va.gov" className="underline underline-offset-4">
                    HAC.FMP@va.gov
                  </a>
                </p>
              </div>

              <div className="rounded-lg border border-(--border) p-4">
                <h3 className="font-semibold">By Mail</h3>
                <p className="mt-2">Fill out VA Form 10-7959f-1 and mail to:</p>
                <pre className="small mt-2 whitespace-pre-wrap rounded bg-(--muted)/10 p-3">
{`VHA Office of Integrated Veteran Care
Foreign Medical Program (FMP)
PO Box 200
Spring City, PA 19475
USA`}
                </pre>
              </div>

              <div className="rounded-lg border border-(--border) p-4">
                <h3 className="font-semibold">By Fax</h3>
                <p className="mt-2">Fill out the form and fax to: 1-303-331-7803</p>
              </div>
            </div>

            <div className="rounded-lg bg-(--brand)/10 border border-(--brand)/40 p-4">
              <h3 className="font-semibold">What to expect after registration</h3>
              <ul className="list-disc pl-5 mt-2">
                <li>
                  VA will send you a “Benefits Authorization Letter” listing your covered
                  service-connected conditions under FMP. If it has been 45 business days past the date of
                  your approval and you have not received your benefits authorization letter email{" "}
                  <a href="mailto:HAC.FMP@va.gov" className="underline underline-offset-4">
                    HAC.FMP@va.gov
                  </a>{" "}
                  and call them to request that they email you the letter.
                </li>
              </ul>
            </div>
          </Card>

          <Card
            id="finding-providers"
            badge="4"
            title="Finding and Choosing a Healthcare Facility Abroad"
          >
            <ul className="list-disc pl-5">
              <li>
                FMP does not have a network of required providers. You may select any licensed provider abroad.
                Some healthcare facilities are direct-billing facilities, meaning any care you receive in
                regard to your service-connected disabilities recognized by the VA will not come out of your
                pocket as the facility will bill the VAFMP directly. See our{" "}
                <Link href="/providers">
                  <strong>Providers page</strong>
                </Link>{" "}
                for an up-to-date rectory with map locations and contact numbers of direct-billing facilities
                in Thailand and the Philippines.
              </li>
              <li>
                But note: If you should choose to receive care at a facility that is not a direct-billing
                facility you will be required to pay out-of-pocked first and then file a claim for reimbursement.
              </li>
              <li>
                Recommended: Ask the provider if they can provide itemized bills and medical documentation in
                English. If in another language, translation is required and may delay claim processing. Be sure
                they indicate the service connected condition the treatment you received was for.
              </li>
            </ul>
          </Card>

          <Card id="claims" badge="5" title="How to File a Claim">
            <div className="rounded-lg border border-(--border) p-4">
              <h3 className="font-semibold">When your provider bills VA directly:</h3>
              <p className="mt-2">
                Works if the provider agrees; you still need the authorization and documentation to register at
                the facility. You will need to provide your FMP Benefits Authorization Letter as well as your
                identification. Accepted forms of identification include military IDs, VA IDs and passports. Do
                not let the facility tell you that the passport is not accepted, the FMP allows for this. You may
                also provide your proof of service and or other VA.gov generated documents to provide alongside
                your passport in order to have a smoother registration process at the healthcare facility where
                you will be receiving treatment.
              </p>
            </div>

            <div className="rounded-lg border border-(--border) p-4">
              <h3 className="font-semibold">When you pay the provider and then file a claim:</h3>
              <ul className="list-disc pl-5 mt-2">
                <li>Use form VA Form 10-7959f-2 (FMP Claim Cover Sheet).</li>
                <li>Must be filed within 2 years of date of service.</li>
                <li>
                  Documents to include: itemized billing statement (with provider full name, phone,
                  office/billing address), proof of payment, diagnosis, treatment date(s). Additional documentation
                  depending on type (inpatient, equipment, prescriptions)
                </li>
                <li>Mail/fax/email claim to:</li>
              </ul>

              <pre className="small mt-2 whitespace-pre-wrap rounded bg-(--muted)/10 p-3">
{`VHA Office of Community Care
Foreign Medical Program (FMP)
PO Box 469061
Denver, CO 80246-9061
USA
Fax: 1-303-331-7803
Phone: 1-303-331-7590
Email: HAC.FMP@VA.gov`}
              </pre>
            </div>
          </Card>

          <Card id="coverage" badge="6" title="What Benefits Are Covered & Limitations">
            <ul className="list-disc pl-5">
              <li>
                Benefits are for services needed to treat a covered service-connected disability or a
                condition that aggravates a service-connected disability.
              </li>
              <li>Care in the U.S. or U.S. territories is not covered under FMP.</li>
              <li>
                Non-service-connected conditions are generally not covered unless part of a VA Vocational
                Rehabilitation/Employment (Ch. 31 VR&amp;E) program authorization.
              </li>
              <li>
                Payments are made in U.S. dollars; if you paid abroad, VA reimburses converted at
                date-of-service rate.
              </li>
            </ul>
          </Card>

          <Card id="contacts" badge="7" title="Contact & Resources">
            <ul className="list-disc pl-5">
              <li>
                General email:{" "}
                <a href="mailto:HAC.FMP@va.gov" className="underline underline-offset-4">
                  HAC.FMP@va.gov
                </a>
              </li>
              <li>
                General phone (U.S.):{" "}
                <a href="tel:+18773458179" className="underline underline-offset-4">
                  877-345-8179
                </a>
              </li>
              <li>
                Fax:{" "}
                <a href="tel:+13033317803" className="underline underline-offset-4">
                  1-303-331-7803
                </a>
              </li>
              <li>Toll-free international numbers:</li>
              <ul className="list-disc pl-5">
                <li>
                  Australia:{" "}
                  <a href="tel:1800354965" className="underline underline-offset-4">
                    1-800-354-965
                  </a>
                </li>
                <li>
                  Germany:{" "}
                  <a href="tel:08001800011" className="underline underline-offset-4">
                    0800-1800-011
                  </a>
                </li>
                <li>
                  Italy:{" "}
                  <a href="tel:800782655" className="underline underline-offset-4">
                    800-782-655
                  </a>
                </li>
                <li>
                  Japan:{" "}
                  <a href="tel:00531130871" className="underline underline-offset-4">
                    00531-13-0871
                  </a>
                </li>
              </ul>
              <li>
                Official website:{" "}
                <a
                  href="https://www.va.gov/health-care/foreign-medical-program/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  va.gov/health-care/foreign-medical-program
                </a>
              </li>
            </ul>
          </Card>

          <Card id="checklist" badge="8" title="Quick Step-by-Step Checklist">
            <ol className="list-decimal pl-6 space-y-1">
              <li>Check you’re eligible (service-connected disability + abroad)</li>
              <li>
                Register for FMP, preferably no less than 45-60 business days prior to
                departure.(online/mail/fax)
              </li>
              <li>Receive your benefits authorization letter</li>
              <li>
                Locate a provider abroad willing to bill VA directly or plan to pay and file a claim for
                reimbursement.
              </li>
              <li>Undergo treatment for your covered condition abroad</li>
              <li>
                If you paid: File your claim within 2 years using VA Form 10-7959f-2 + documentation in
                Enligsh.
              </li>
              <li>Monitor your direct deposit or check payment from VA</li>
              <li>Keep copies of all bills, receipts, correspondence, claim numbers, etc.</li>
              <li>If you change address or banking info: notify FMP immediately</li>
            </ol>
          </Card>

          <Card id="links" badge="9" title="Key Links (Official)">
            <ul className="list-disc pl-5">
              <li>
                FMP main page:{" "}
                <a
                  href="https://www.va.gov/health-care/foreign-medical-program/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  https://www.va.gov/health-care/foreign-medical-program/
                </a>
              </li>
              <li>
                How to file a claim:{" "}
                <a
                  href="https://www.va.gov/resources/how-to-file-a-va-foreign-medical-program-claim/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  https://www.va.gov/resources/how-to-file-a-va-foreign-medical-program-claim/
                </a>
              </li>
              <li>VA Form 10­-7959f-1 (Registration)</li>
              <li>VA Form 10­-7959f-2 (Claim Cover Sheet)</li>
            </ul>

            <div className="pt-2">
              <Link href="/providers" className="btn btn-primary no-underline">
                Providers page
              </Link>
            </div>
          </Card>

          <Card id="tips" badge="10" title="Tips for Overseas Veterans">
            <ul className="list-disc pl-5">
              <li>
                Carry a printed copy or digital scan of your benefits authorization letter to every appointment you have as every facility will ask for proof of coverage and you will need it to link your treatment to your service-connected condition(s).
              </li>
              <li>Keep all documents in English when possible to avoid translation delays.</li>
              <li>Prioritize providers willing to directly bill the VA to reduce your up-front costs.</li>
              <li>Be aware of currency conversion and keep receipts showing date of service clearly.</li>
              <li>Notify FMP each time you change address, phone number, or banking info - especially important!</li>
              <li>Save your claim number(s) and any correspondence from VA; it may take time to get reimbursed.</li>
            </ul>
          </Card>

          {/* Back to top */}
          <div className="flex justify-end">
            <a href="#top" className="btn btn-secondary no-underline">
              Back to top
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}