// app/resources/page.tsx
import Link from "next/link";

export default function ResourcesPage() {
  return (
    <section className="container py-12">
      <h1 className="h1 mb-4">Resources</h1>
      <p className="muted mb-6">
        Starter resources for getting oriented with the Foreign Medical Program
        (FMP).
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="card">
          <h2 className="font-semibold">Getting started guide</h2>
          <p className="small mt-1">
            Eligibility, enrollment, and your first steps overseas.
          </p>
        </article>
        <article className="card">
          <h2 className="font-semibold">FAQ</h2>
          <p className="small mt-1">
            Common questions about claims, pre-authorization, and emergencies.
          </p>
        </article>
        <article className="card sm:col-span-2">
          <h2 className="font-semibold">Contact support</h2>
          <p className="small mt-1">
            Need help? Head to the <strong><Link href="/contact">contact page</Link></strong> and reach out.
          </p>
        </article>
      </div>
    </section>
  );
}