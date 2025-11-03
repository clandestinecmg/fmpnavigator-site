"use client";

import type { ReactNode } from "react";
import AuthProvider from "@/components/AuthProvider";

/**
 * ClientRoot
 * ----------
 * Global client-only wrappers (auth, theme, query clients, etc.) live here.
 * Keep this minimal; anything that can run on the server should remain there.
 */
export default function ClientRoot({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
