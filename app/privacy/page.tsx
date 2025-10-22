// app/privacy/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy · FMP Navigator',
  description: 'How we handle your information responsibly and securely.',
};

export default function PrivacyPage() {
  return (
    <section className="container py-8 space-y-6">
      <h1 className="h1">Privacy Policy</h1>
      <p className="muted">
        FMP Navigator respects your privacy. We do not sell or share your personal data.
      </p>

      <div className="card space-y-4">
        <p>
          We collect minimal information necessary for user authentication and app analytics.
          Firebase Authentication and Firestore are used with strict access rules.
        </p>
        <p>
          You can request deletion of your data at any time by contacting{' '}
          <a href="mailto:support@fmpnavigator.org" className="link-underline">support@fmpnavigator.org</a>.
        </p>
      </div>
    </section>
  );
}