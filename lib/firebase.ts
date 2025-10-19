'use client';
// lib/firebase.ts — client-only Firebase init for Next.js (App Router)

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    // Warn (don’t throw) so dev server still boots and you see the message
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[firebase] Missing env ${name}`);
    }
  }
  return v as string;
}

const firebaseConfig = {
  apiKey: requireEnv('NEXT_PUBLIC_FB_API_KEY'),
  authDomain: requireEnv('NEXT_PUBLIC_FB_AUTH_DOMAIN'),
  projectId: requireEnv('NEXT_PUBLIC_FB_PROJECT_ID'),
  storageBucket: requireEnv('NEXT_PUBLIC_FB_STORAGE_BUCKET'),
  appId: requireEnv('NEXT_PUBLIC_FB_APP_ID'),
  // Optional (set them in .env if you use these features)
  // messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER_ID,
  // measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
};

// Singleton
const firebaseApp: FirebaseApp =
  getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);
export const storage: FirebaseStorage = getStorage(firebaseApp);