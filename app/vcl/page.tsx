// app/vcl/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Veterans Crisis Support | FMP Navigator",
  description:
    "Immediate, confidential support for veterans, service members, and families. Call, chat, or text the Veterans Crisis Line (VCL).",
};

const OCONUS = [
  { key: "NORTHCOM", title: "NORTHCOM", offBase: "Dial 988 then Press 1", tel: "tel:988", dsn: "988" },
  { key: "PACOM", title: "PACOM", offBase: "+1 844-702-5493", tel: "tel:+18447025493", dsn: "988" },
  { key: "EUCOM", title: "EUCOM", offBase: "+1 844-702-5495", tel: "tel:+18447025495", dsn: "988" },
  { key: "CENTCOM", title: "CENTCOM", offBase: "+1 855-422-7719", tel: "tel:+18554227719", dsn: "988" },
  { key: "AFRICOM", title: "AFRICOM", offBase: "+1 888-482-6054", tel: "tel:+18884826054", dsn: "988" },
  { key: "SOUTHCOM", title: "SOUTHCOM", offBase: "+1 866-989-9599", tel: "tel:+18669899599", dsn: "988" },
];

export default function VCLPage() {
  return (
    <main className="container py-10 space-y-10">
      <section aria-labelledby="urgent-danger" className="rounded-2xl p-5 bg-(--crimson) text-white">
        <h2 id="urgent-danger" className="h3">If you’re in immediate danger</h2>
        <p className="mt-1">
          Call local emergency services right now. If you can safely do so, stay with someone you trust and remove
          access to anything you could use to harm yourself until help arrives.
        </p>
      </section>

      <section aria-labelledby="vcl-hero" className="rounded-2xl p-6 md:p-8 bg-(--card) elevate">
        <h1 id="vcl-hero" className="h1">Veterans Crisis Support</h1>
        <p className="muted mt-2">
          If you’re thinking about suicide, feeling unsafe, or worried about a veteran or service member,
          confidential help is available 24/7 through the U.S. Veterans Crisis Line (VCL).
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <a href="tel:988" className="btn btn-primary w-full text-center" aria-label="Call 988 then press 1">
            Call 988, then press 1
          </a>
          <a
            href="https://www.veteranscrisisline.net/get-help-now/chat/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full text-center"
            aria-label="Open secure chat with the Veterans Crisis Line"
          >
            Start a confidential chat
          </a>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <a href="sms:838255" className="btn btn-primary w-full text-center" aria-label="Text the VCL at 838255">
            Text 838255
          </a>
          <a
            href="https://www.veteranscrisisline.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full text-center"
            aria-label="Visit veteranscrisisline.net"
          >
            Visit veteranscrisisline.net
          </a>
        </div>

        <p className="text-sm text-(--muted-2) mt-4">
          The VCL supports veterans, service members (including National Guard and Reserve), and their families or friends.
          You do not have to be enrolled in VA benefits to use it.
        </p>
      </section>

      <section aria-labelledby="how-to-reach" className="space-y-4">
        <h2 id="how-to-reach" className="h2">Ways to reach the VCL</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="card">
            <h3 className="h3">Call</h3>
            <p>Dial <strong>988</strong> and then press <strong>1</strong> to connect with responders trained to support veterans and service members.</p>
            <ul className="list-disc pl-5 mt-2 text-sm text-(--muted)">
              <li>Available 24/7, free and confidential.</li>
              <li>No enrollment in VA care required.</li>
            </ul>
          </article>

          <article className="card">
            <h3 className="h3">Chat (web)</h3>
            <p>Prefer typing? Use the secure web chat. You’ll be connected with a trained responder in a private session.</p>
            <p className="mt-3">
              <a
                href="https://www.veteranscrisisline.net/get-help-now/chat/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                aria-label="Open VCL Chat"
              >
                Open VCL Chat
              </a>
            </p>
          </article>

          <article className="card">
            <h3 className="h3">Text</h3>
            <p>Send a text to <strong>838255</strong> to message with a responder. This can be helpful when calling isn’t possible.</p>
            <p className="mt-3">
              <a href="sms:838255" className="btn btn-primary" aria-label="Text the Veterans Crisis Line at 838255">
                Text 838255
              </a>
            </p>
          </article>
        </div>
      </section>

      <section aria-labelledby="outside-us" className="space-y-4">
        <h2 id="outside-us" className="h2">If you’re outside the United States (OCONUS)</h2>
        <p>
          If calling <strong>988</strong> doesn’t work with your carrier, use the secure web chat or try the
          appropriate regional number below. On installations with DSN access, dial <strong>988</strong>.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {OCONUS.map(({ key, title, offBase, tel, dsn }) => (
            <article key={key} className="card">
              <h3 className="h3">{title}</h3>
              <div className="mt-2 space-y-2">
                <div className="text-sm text-(--muted)">
                  <span className="font-medium">Off-base:&nbsp;</span>
                  <span>{offBase}</span>
                </div>
                <div className="text-sm text-(--muted)">
                  <span className="font-medium">DSN:&nbsp;</span>{dsn}
                </div>
                <div className="pt-1">
                  <a href={tel} className="btn btn-primary w-full text-center" aria-label={`${title} off-base number ${offBase}`}>
                    {offBase}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="text-sm text-(--muted)">If a regional number doesn’t connect from your location, try another region or use web chat.</p>
      </section>

      <section aria-labelledby="safety-tools" className="space-y-3">
        <h2 id="safety-tools" className="h2">Safety planning & coping tools</h2>
        <p>The VCL site includes guides and tools to help you create a personal safety plan, identify warning signs, and list supportive contacts.</p>
        <p className="mt-2">
          <a
            href="https://www.veteranscrisisline.net/resources/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            aria-label="Open VCL Resources"
          >
            Open VCL Resources
          </a>
        </p>
      </section>

      <section aria-labelledby="disclaimer" className="text-sm text-(--muted)">
        <h2 id="disclaimer" className="sr-only">Disclaimer</h2>
        <p>FMP Navigator is not affiliated with the U.S. Department of Veterans Affairs or the Veterans Crisis Line. This page links to official resources so you can reach professional, confidential support as quickly as possible.</p>
        <p className="mt-2">
          <Link href="/resources" className="btn btn-primary" aria-label="See our resources">
            See our resources
          </Link>
        </p>
      </section>
    </main>
  );
}