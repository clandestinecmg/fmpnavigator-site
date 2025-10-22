// declarations.d.ts

// Minimal window.grecaptcha typing so TS is happy in client code.
declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
      render?: any;
      reset?: any;
    };
  }
}

// If you already had other ambient types here, keep them.
// Ensure this file is included by tsconfig.json "include".
export {};