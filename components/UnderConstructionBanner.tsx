// components/UnderConstructionBanner.tsx
export default function UnderConstructionBanner() {
  // Fixed, larger banner; matches BANNER_REM=4 in layout.tsx
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "var(--gold)",
        color: "var(--ink)",
        borderBottom: "1px solid var(--border)",
        minHeight: "4rem", // was 3rem
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 1rem",
        textAlign: "center",
        boxShadow: "var(--shadow)",
      }}
    >
      <span className="font-semibold text-base md:text-lg">
        🚧&nbsp;FMP Navigator is under construction — some pages and forms may be temporarily unavailable.
      </span>
    </div>
  );
}