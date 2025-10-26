'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

/**
 * AuthContext
 * -----------
 * Wraps Firebase Auth with:
 * - SSR safety
 * - Local persistence
 * - Optional email verification on sign-up
 * - Helpers for sign-in, sign-up, sign-out, reset password, update profile
 *
 * Env controls:
 * - NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION="1" => send verification email after sign up
 * - NEXT_PUBLIC_FIREBASE_EMULATOR="1"         => use Auth emulator (configured in lib/firebase.ts)
 */

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  /** Last auth-related error message (normalized for display); cleared on successful calls. */
  error: string | null;

  // Core flows
  signInEmail: (email: string, password: string) => Promise<UserCredential>;
  signUpEmail: (email: string, password: string) => Promise<UserCredential>;
  signOutUser: () => Promise<void>;

  // Helpful extras
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (params: { displayName?: string; photoURL?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};

const REQUIRE_EMAIL_VERIFICATION =
  typeof window !== 'undefined' && process.env.NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION === '1';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Guard so we only set persistence once
  const didSetPersistence = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const auth = getFirebaseAuth();

    // Ensure durable sessions in browser
    if (!didSetPersistence.current) {
      didSetPersistence.current = true;
      // Best-effort; if it fails (3P cookies disabled, etc.) we ignore and continue
      setPersistence(auth, browserLocalPersistence).catch(() => {});
    }

    // Subscribe to auth state
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return unsub;
  }, []);

  // Normalize common Firebase auth errors for UI
  const normalizeError = (e: unknown): string => {
    if (!e || typeof e !== 'object') return 'Unexpected error';
    const anyErr = e as { code?: string; message?: string };
    switch (anyErr.code) {
      case 'auth/invalid-email':
        return 'The email address is invalid.';
      case 'auth/user-disabled':
        return 'This user account has been disabled.';
      case 'auth/user-not-found':
        return 'No user found with that email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'This email is already in use.';
      case 'auth/weak-password':
        return 'Password is too weak.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      default:
        return anyErr.message || 'Authentication error';
    }
  };

  const signInEmail = async (email: string, password: string) => {
    try {
      setError(null);
      const cred = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      return cred;
    } catch (e) {
      const msg = normalizeError(e);
      setError(msg);
      throw e;
    }
  };

  const signUpEmail = async (email: string, password: string) => {
    try {
      setError(null);
      const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);

      // Optionally send verification
      if (REQUIRE_EMAIL_VERIFICATION && cred.user) {
        try {
          await sendEmailVerification(cred.user);
        } catch {
          // Non-fatal; do not block sign-up
        }
      }

      return cred;
    } catch (e) {
      const msg = normalizeError(e);
      setError(msg);
      throw e;
    }
  };

  const signOutUser = async () => {
    try {
      setError(null);
      await signOut(getFirebaseAuth());
    } catch (e) {
      const msg = normalizeError(e);
      setError(msg);
      throw e;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(getFirebaseAuth(), email);
    } catch (e) {
      const msg = normalizeError(e);
      setError(msg);
      throw e;
    }
  };

  const updateUserProfile = async (params: { displayName?: string; photoURL?: string }) => {
    if (!getFirebaseAuth().currentUser) return;
    try {
      setError(null);
      await updateProfile(getFirebaseAuth().currentUser!, params);
      // reflect changes locally
      setUser({ ...getFirebaseAuth().currentUser! });
    } catch (e) {
      const msg = normalizeError(e);
      setError(msg);
      throw e;
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      error,
      signInEmail,
      signUpEmail,
      signOutUser,
      resetPassword,
      updateUserProfile,
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };