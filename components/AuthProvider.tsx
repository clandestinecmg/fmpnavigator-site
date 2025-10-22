// components/AuthProvider.tsx
'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, type User, type UserCredential } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<UserCredential>;
  signUpEmail: (email: string, password: string) => Promise<UserCredential>;
  signOutUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInEmail = (email: string, password: string) =>
    signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  const signUpEmail = (email: string, password: string) =>
    createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
  const signOutUser = () => signOut(getFirebaseAuth());

  const value = useMemo(() => ({ user, loading, signInEmail, signUpEmail, signOutUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}