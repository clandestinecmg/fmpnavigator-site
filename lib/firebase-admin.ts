// lib/firebase-admin.ts
// Server-only Firebase Admin init for Next.js (use in API routes / server components)

import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`[firebase-admin] Missing env: ${name}`);
  return v;
}

const adminCreds = {
  projectId: requireEnv('FIREBASE_PROJECT_ID'),
  clientEmail: requireEnv('FIREBASE_CLIENT_EMAIL'),
  // Important: turn "\n" into real newlines
  privateKey: requireEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
};

const adminApp: App =
  getApps().length > 0 ? getApps()[0]! : initializeApp({ credential: cert(adminCreds) });

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);
export default adminApp;