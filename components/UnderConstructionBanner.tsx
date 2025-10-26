'use client';

export default function UnderConstructionBanner() {
  return (
    <div className="bg-yellow-500 text-black text-center py-3 px-4 text-sm font-medium shadow-md z-50 fixed top-0 left-0 right-0">
      🚧 <span className="font-semibold">FMP Navigator Website Under Construction</span> — 
      some features may be unavailable. Please check back soon!
    </div>
  );
}