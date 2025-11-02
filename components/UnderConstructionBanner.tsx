// components/UnderConstructionBanner.tsx
export default function UnderConstructionBanner() {
  // Pure server-safe markup, no client hooks.
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 left-0 right-0 z-[100] text-white"
      style={{
        background: 'var(--navy)',
        borderBottom: '1px solid var(--border)',
        padding: '0.75rem 1rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow)',
      }}
    >
      🚧 <span className="font-semibold">FMP Navigator is under construction</span> — some pages and forms may be temporarily unavailable.
    </div>
  );
}