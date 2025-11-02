// app/privacy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | FMP Navigator",
  description:
    "Learn how FMP Navigator collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="container max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4 text-sm text-[var(--muted-foreground)]">Last updated: {lastUpdated}</p>

      <section className="space-y-6 text-base leading-relaxed">
        <p>
          <strong>FMP Navigator</strong> (“we,” “us,” or “our”) is a veteran-founded nonprofit
          initiative. This Privacy Policy explains what information we collect, how we use it,
          and the choices you have. By using{" "}
          <a href="https://fmpnavigator.org" className="text-blue-500 underline">
            fmpnavigator.org
          </a>{" "}
          and related services (the “Service”), you agree to this Policy.
        </p>

        <h2 className="text-xl font-semibold mt-8">1. What We Collect</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Information you provide</strong>: name, email, subject, and message when you use
            our contact form; optional attachments you upload.
          </li>
          <li>
            <strong>Device and usage data</strong>: IP address, user-agent, pages visited, timestamps (standard
            web server logs).
          </li>
          <li>
            <strong>Security signals</strong> (reCAPTCHA v3): Google may collect device, browser, and interaction
            metadata to help us detect abuse.
          </li>
          <li>
            <strong>Location & maps</strong>: When viewing maps, Google may process your IP and
            browser details to render tiles and places data.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">2. How We Use Information</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Respond to inquiries and support requests.</li>
          <li>Operate and improve the Service, including reliability and security.</li>
          <li>Prevent spam, fraud, and abuse (e.g., reCAPTCHA checks, basic firewall rules).</li>
          <li>
            Comply with legal requirements or requests from authorities when applicable.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">3. Lawful Bases (where applicable)</h2>
        <p>
          Depending on your location, we rely on one or more of the following:{" "}
          <em>consent</em> (e.g., submitting the contact form),{" "}
          <em>legitimate interests</em> (e.g., site security, responding to messages), and{" "}
          <em>legal obligations</em>.
        </p>

        <h2 className="text-xl font-semibold mt-8">4. Service Providers (Processors)</h2>
        <p className="mb-2">We use reputable vendors to run the Service:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Vercel</strong> (hosting/deployment).
          </li>
          <li>
            <strong>Firebase</strong> (Google) for web app services and static assets (per your config).
          </li>
          <li>
            <strong>EmailJS</strong> to deliver contact form messages and optional auto-replies.
          </li>
          <li>
            <strong>Google reCAPTCHA v3</strong> to help prevent spam and automated abuse.
          </li>
          <li>
            <strong>Google Maps Platform</strong> to render maps and places data in the Providers page.
          </li>
          <li>
            <strong>Sentry</strong> (error monitoring) to improve stability and diagnose crashes.
          </li>
        </ul>
        <p>
          These providers may process personal data on our behalf under their own terms and privacy
          policies. We only share what’s needed to provide the Service.
        </p>

        <h2 className="text-xl font-semibold mt-8">5. Cookies & Similar Technologies</h2>
        <p>
          We use only the minimum necessary cookies/tech to operate core features and prevent abuse.
          Third-party embeds (e.g., Google Maps, reCAPTCHA) may set their own cookies subject to
          their policies. You can adjust browser settings to limit cookies; doing so may affect site
          functionality.
        </p>

        <h2 className="text-xl font-semibold mt-8">6. Data Retention</h2>
        <p>
          Contact submissions are retained as long as needed to address your request and maintain
          reliable records, then deleted or anonymized. Security logs are kept for a limited period
          necessary for troubleshooting and fraud prevention.
        </p>

        <h2 className="text-xl font-semibold mt-8">7. International Transfers</h2>
        <p>
          We operate internationally (including from Thailand) and use providers that may process
          data in multiple regions. We take reasonable steps to protect data during transfers and
          rely on appropriate safeguards where required by law.
        </p>

        <h2 className="text-xl font-semibold mt-8">8. Your Rights</h2>
        <p>
          Depending on your jurisdiction, you may have rights to access, correct, delete, or
          restrict processing of your personal data. To exercise these rights, contact{" "}
          <a href="mailto:support@fmpnavigator.org" className="text-blue-500 underline">
            support@fmpnavigator.org
          </a>. We’ll verify requests and respond as required by applicable law.
        </p>

        <h2 className="text-xl font-semibold mt-8">9. Children’s Privacy</h2>
        <p>
          Our Service is not directed to children under 13 (or the minimum age in your jurisdiction).
          We do not knowingly collect personal information from children.
        </p>

        <h2 className="text-xl font-semibold mt-8">10. Security</h2>
        <p>
          We use reasonable technical and organizational measures (e.g., HTTPS, access controls,
          basic firewall and bot protections, least-privilege vendor access). No method of
          transmission or storage is 100% secure; please use the Service accordingly.
        </p>

        <h2 className="text-xl font-semibold mt-8">11. Third-Party Links</h2>
        <p>
          Our site may contain links to third-party websites. We’re not responsible for their
          content or practices. Review their policies before providing personal information.
        </p>

        <h2 className="text-xl font-semibold mt-8">12. Changes to this Policy</h2>
        <p>
          We may update this Policy from time to time. Updates will be posted here with a new “Last
          updated” date. Your continued use of the Service after changes means you accept the updated
          Policy.
        </p>

        <h2 className="text-xl font-semibold mt-8">13. Contact Us</h2>
        <p>
          Questions or requests? Email{" "}
          <a href="mailto:support@fmpnavigator.org" className="text-blue-500 underline">
            support@fmpnavigator.org
          </a>.
        </p>
      </section>
    </main>
  );
}