// app/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | FMP Navigator",
  description:
    "Read the Terms and Conditions governing use of FMP Navigator's website and services.",
};

export default function TermsPage() {
  return (
    <main className="container max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p className="mb-4 text-sm text-[var(--muted-foreground)]">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      <section className="space-y-6 text-base leading-relaxed">
        <p>
          Welcome to <strong>FMP Navigator</strong> (“we,” “us,” or “our”). By
          accessing or using our website (<a href="https://fmpnavigator.org" className="text-blue-500 underline">fmpnavigator.org</a>)
          or related services (collectively, the “Service”), you agree to be
          bound by these Terms and Conditions (“Terms”). Please read them
          carefully before using our platform.
        </p>

        <h2 className="text-xl font-semibold mt-8">1. Purpose</h2>
        <p>
          FMP Navigator is a veteran-founded nonprofit initiative that provides
          educational and advocacy resources related to the U.S. Department of
          Veterans Affairs (VA) Foreign Medical Program (FMP). We are not an
          official government agency and do not provide medical, legal, or
          financial advice.
        </p>

        <h2 className="text-xl font-semibold mt-8">2. Eligibility</h2>
        <p>
          You must be at least 18 years old to use this Service. By accessing
          our website, you confirm that you meet this age requirement and agree
          to comply with all applicable laws and regulations.
        </p>

        <h2 className="text-xl font-semibold mt-8">3. Use of Information</h2>
        <p>
          The content provided on this website is for general informational
          purposes only. While we strive for accuracy, we do not guarantee that
          all information is complete, current, or free from errors. Users are
          encouraged to verify any information directly with the VA or other
          official sources.
        </p>

        <h2 className="text-xl font-semibold mt-8">4. Medical Disclaimer</h2>
        <p>
          FMP Navigator does not provide medical diagnoses, treatment, or
          professional health advice. All health-related content is
          informational only. Always consult a qualified healthcare provider for
          medical advice or treatment.
        </p>

        <h2 className="text-xl font-semibold mt-8">5. Privacy & Data</h2>
        <p>
          We respect your privacy. Personal data collected through forms,
          subscriptions, or email communication is handled in accordance with
          our <a href="/privacy" className="text-blue-500 underline">Privacy Policy</a>.
          We do not sell or share personal data with third parties without your
          consent, except as required by law.
        </p>

        <h2 className="text-xl font-semibold mt-8">6. Third-Party Services</h2>
        <p>
          Our site may include links or integrations with third-party services
          such as Google Maps, Firebase, or EmailJS. These providers are governed
          by their own terms and privacy policies. We are not responsible for
          their practices or content.
        </p>

        <h2 className="text-xl font-semibold mt-8">7. Intellectual Property</h2>
        <p>
          All trademarks, graphics, and content on this website are the property
          of FMP Navigator unless otherwise stated. You may not reproduce or
          distribute materials from our site without prior written permission.
        </p>

        <h2 className="text-xl font-semibold mt-8">8. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, FMP Navigator, its volunteers,
          and affiliates shall not be liable for any damages arising from your
          use of the Service or reliance on any information provided herein.
        </p>

        <h2 className="text-xl font-semibold mt-8">9. Changes to These Terms</h2>
        <p>
          We may revise these Terms periodically. Any updates will be posted on
          this page with a new “Last updated” date. Continued use of the site
          after such changes constitutes acceptance of the updated Terms.
        </p>

        <h2 className="text-xl font-semibold mt-8">10. Contact</h2>
        <p>
          For questions about these Terms or the Service, contact us at{" "}
          <a href="mailto:support@fmpnavigator.org" className="text-blue-500 underline">
            support@fmpnavigator.org
          </a>.
        </p>
      </section>
    </main>
  );
}