// app/app/page.tsx
export default function AppShowcase() {
  return (
    <section className="container py-10 space-y-6">
      <h1 className="h1">FMP Navigator App</h1>
      <p className="muted">
        Currently in closed beta. Cross-platform mobile app for U.S. veterans overseas to find FMP providers,
        file claims, and manage documentation.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <img src="/app-screenshot1.png" className="rounded-xl elevate" alt="App screenshot one" />
        <img src="/app-screenshot2.png" className="rounded-xl elevate" alt="App screenshot two" />
      </div>

      <div className="card">
        <h2 className="h2 mb-2">Status</h2>
        <p>Android build: ✅ Testing • iOS: ⏳ Under review</p>
        <p className="mt-3">Join the waitlist below to test upcoming builds.</p>
        <a href="/contact" className="btn btn-primary mt-4 w-fit">Join the waitlist</a>
      </div>
    </section>
  );
}