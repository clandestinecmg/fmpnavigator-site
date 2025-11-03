// app/(auth)/signin/page.tsx
"use client";

import React, { useState, type FormEvent } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function SignInPage() {
  const { user, loading, signInEmail, signUpEmail, signOutUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      if (mode === "signin") await signInEmail(email, password);
      else await signUpEmail(email, password);
    } catch (err: any) {
      setError(err?.message ?? "Authentication failed");
    }
  }

  if (loading) {
    return (
      <section className="container py-8">
        <div className="card">Checking session…</div>
      </section>
    );
  }

  if (user) {
    return (
      <section className="container py-8 space-y-4">
        <div className="card">
          <p className="mb-3">
            Signed in as <strong>{user.email}</strong>
          </p>
          <button className="btn btn-ghost" onClick={signOutUser}>
            Sign out
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-8 max-w-md">
      <div className="card space-y-4">
        <h1 className="h2">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        {error && <p className="small text-red-400">{error}</p>}

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
          />
          <button className="btn btn-primary w-full" type="submit">
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          className="btn btn-ghost w-full"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin"
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </section>
  );
}
