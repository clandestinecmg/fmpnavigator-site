// lib/firebase.ts
"use client";

import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";
import {
  getAuth,
  type Auth,
  setPersistence,
  browserLocalPersistence,
  connectAuthEmulator,
} from "firebase/auth";
import {
  getFirestore,
  type Firestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import {
  getStorage,
  type FirebaseStorage,
  connectStorageEmulator,
} from "firebase/storage";

/**
 * FMP Navigator — Firebase Web SDK (client)
 * - Initializes App, Auth (local persistence), Firestore, Storage
 * - Optional local emulators when NEXT_PUBLIC_FIREBASE_EMULATOR="1"
 * - Logs masked config in dev
 *
 * Required env:
 *  NEXT_PUBLIC_FB_API_KEY
 *  NEXT_PUBLIC_FB_AUTH_DOMAIN
 *  NEXT_PUBLIC_FB_PROJECT_ID
 *  NEXT_PUBLIC_FB_STORAGE_BUCKET
 *  NEXT_PUBLIC_FB_APP_ID
 *
 * Optional:
 *  NEXT_PUBLIC_FB_SENDER_ID
 *  NEXT_PUBLIC_FB_MEASUREMENT_ID
 *  NEXT_PUBLIC_FIREBASE_EMULATOR="1"  // enables localhost emulators
 */

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;
let _authPersistenceSet = false;
let _emulatorsConnected = false;

function assertDefined<T>(val: T | undefined, name: string): T {
  if (val === undefined || val === "") {
    const msg = `[firebase] Missing env: ${name}. Check your .env.local / Vercel env.`;
    if (process.env.NODE_ENV === "production") throw new Error(msg);
    console.warn(msg);
  }
  return val as T;
}

function usingEmulators(): boolean {
  return process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === "1";
}

export function getFirebaseApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error(
      "[firebase] getFirebaseApp() called on server. Use firebase-admin instead.",
    );
  }
  if (_app) return _app;

  const cfg: FirebaseOptions = {
    apiKey: assertDefined(
      process.env.NEXT_PUBLIC_FB_API_KEY,
      "NEXT_PUBLIC_FB_API_KEY",
    ),
    authDomain: assertDefined(
      process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
      "NEXT_PUBLIC_FB_AUTH_DOMAIN",
    ),
    projectId: assertDefined(
      process.env.NEXT_PUBLIC_FB_PROJECT_ID,
      "NEXT_PUBLIC_FB_PROJECT_ID",
    ),
    storageBucket: assertDefined(
      process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
      "NEXT_PUBLIC_FB_STORAGE_BUCKET",
    ),
    appId: assertDefined(
      process.env.NEXT_PUBLIC_FB_APP_ID,
      "NEXT_PUBLIC_FB_APP_ID",
    ),
    ...(process.env.NEXT_PUBLIC_FB_SENDER_ID
      ? { messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER_ID }
      : {}),
    ...(process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID
      ? { measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID }
      : {}),
  };

  if (
    process.env.NODE_ENV !== "production" &&
    !(window as any).__fb_cfg_logged
  ) {
    const masked = String(cfg.apiKey ?? "").replace(
      /^(.{6}).+(.{4})$/,
      "$1•••$2",
    );
    console.log("[firebase] Web SDK config", { ...cfg, apiKey: masked });
    (window as any).__fb_cfg_logged = true;
  }

  _app = getApps().length ? getApp() : initializeApp(cfg);
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (_auth) return _auth;

  const auth = getAuth(getFirebaseApp());

  // Local persistence (survives reloads)
  if (!_authPersistenceSet) {
    _authPersistenceSet = true;
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[firebase] Failed to set auth persistence", err);
      }
    });
  }

  // Optional emulators (local only)
  if (usingEmulators() && !_emulatorsConnected) {
    try {
      connectAuthEmulator(auth, "http://127.0.0.1:9099", {
        disableWarnings: true,
      });
    } catch {
      // ignore if already connected
    }
  }

  _auth = auth;
  return _auth;
}

export function getFirestoreDb(): Firestore {
  if (_db) return _db;
  const db = getFirestore(getFirebaseApp());

  if (usingEmulators() && !_emulatorsConnected) {
    try {
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
    } catch {
      // ignore if already connected
    }
  }

  _db = db;
  return _db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (_storage) return _storage;
  const storage = getStorage(getFirebaseApp());

  if (usingEmulators() && !_emulatorsConnected) {
    try {
      connectStorageEmulator(storage, "127.0.0.1", 9199);
    } catch {
      // ignore if already connected
    }
  }

  _storage = storage;
  _emulatorsConnected = true;
  return _storage;
}
