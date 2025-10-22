// app/_debug-env/page.tsx
export const dynamic = 'force-static';

function mask(v: string | undefined) {
  if (!v) return '(unset)';
  if (v.length <= 8) return '••••';
  return `${v.slice(0, 4)}•••${v.slice(-4)}`;
}

export default function DebugEnvPage() {
  const clientVars = [
    ['NEXT_PUBLIC_RECAPTCHA_SITE_KEY', mask(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)],
    ['NEXT_PUBLIC_EMAILJS_SERVICE_ID', mask(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID)],
    ['NEXT_PUBLIC_EMAILJS_TEMPLATE_ID', mask(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID)],
    ['NEXT_PUBLIC_EMAILJS_PUBLIC_KEY', mask(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY)],
    ['NEXT_PUBLIC_FB_API_KEY', mask(process.env.NEXT_PUBLIC_FB_API_KEY)],
    ['NEXT_PUBLIC_FB_AUTH_DOMAIN', mask(process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN)],
    ['NEXT_PUBLIC_FB_PROJECT_ID', mask(process.env.NEXT_PUBLIC_FB_PROJECT_ID)],
    ['NEXT_PUBLIC_FB_STORAGE_BUCKET', mask(process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET)],
    ['NEXT_PUBLIC_FB_APP_ID', mask(process.env.NEXT_PUBLIC_FB_APP_ID)],
    ['NEXT_PUBLIC_FB_SENDER_ID', mask(process.env.NEXT_PUBLIC_FB_SENDER_ID)],
    ['NEXT_PUBLIC_FB_MEASUREMENT_ID', mask(process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID)],
    ['NEXT_PUBLIC_MAPS_API_KEY', mask(process.env.NEXT_PUBLIC_MAPS_API_KEY)],
    ['NEXT_PUBLIC_MAP_ID', mask(process.env.NEXT_PUBLIC_MAP_ID)],
  ] as const;

  return (
    <section className="container py-10">
      <h1 className="h1 mb-4">Debug Env (client)</h1>
      <p className="mb-6 muted">
        These values are <strong>masked</strong> and only reflect what’s exposed to the browser.
        For server-only secrets, check your terminal or hosting env.
      </p>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--card)]">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Value (masked)</th>
            </tr>
          </thead>
          <tbody>
            {clientVars.map(([k, v]) => (
              <tr key={k} className="border-t border-[var(--border)]">
                <td className="p-3 font-mono">{k}</td>
                <td className="p-3">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="small mt-4">
        Tip: if something shows “(unset)”, add it to <code>.env.local</code> and restart <code>next dev</code>.
      </p>
    </section>
  );
}