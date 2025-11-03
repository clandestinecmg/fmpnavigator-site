// lib/firebase-admin.ts
// Server-only Firebase Admin init for Next.js (API routes or RSC only)

import {
  getApps,
  initializeApp,
  cert,
  type App,
  type AppOptions,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`[firebase-admin] Missing env: ${name}`);
  return value;
}

// Required admin credentials (from service account)
const adminCreds = {
  projectId: requireEnv("FIREBASE_PROJECT_ID"),
  clientEmail: requireEnv("FIREBASE_CLIENT_EMAIL"),
  // Convert escaped newlines to real ones for multiline private keys
  privateKey: requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
};

// Build AppOptions without introducing undefined properties in the literal
const options: AppOptions = {
  credential: cert(adminCreds),
};

// Add storageBucket only if you provided one (avoids exactOptionalPropertyTypes errors)
const bucket = process.env.FIREBASE_STORAGE_BUCKET;
if (bucket && bucket.length > 0) {
  options.storageBucket = bucket;
}

const adminApp: App =
  getApps().length > 0 ? getApps()[0]! : initializeApp(options);

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);

export default adminApp;
