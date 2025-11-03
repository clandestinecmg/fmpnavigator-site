// app/global-error.tsx
"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-dvh container py-10">
        {/* NextError requires a statusCode but App Router doesn’t expose it. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
