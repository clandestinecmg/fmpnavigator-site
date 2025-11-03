// app/app/page.tsx
import Image from "next/image";

export default function AppShowcase() {
  return (
    <section className="container py-10 space-y-6">
      <h1 className="h1">FMP Navigator App</h1>
      <p className="muted">
        Currently in closed beta. Cross-platform mobile app for U.S. veterans
        overseas to find FMP providers, file claims, and manage documentation.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <Image
          src="/app-screenshot1.png"
          alt="App screenshot one"
          width={800}
          height={1600}
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="rounded-xl elevate w-full h-auto"
        />
        <Image
          src="/app-screenshot2.png"
          alt="App screenshot two"
          width={800}
          height={1600}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="rounded-xl elevate w-full h-auto"
        />
      </div>

      <div className="card">
        <h2 className="h2 mb-2">Status</h2>
        <p>Android build: ✅ Testing • iOS: ⏳ Under review</p>
        <p className="mt-3">Join the waitlist below to test upcoming builds.</p>
        <a href="/contact" className="btn btn-primary mt-4 w-fit">
          Join the waitlist
        </a>
      </div>
    </section>
  );
}