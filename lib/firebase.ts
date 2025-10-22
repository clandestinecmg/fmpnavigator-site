// lib/firebase.ts
'use client';

import {
  initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions,
} from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

function assertDefined<T>(val: T | undefined, name: string): T {
  if (val === undefined || val === '') {
    const msg = `[firebase] Missing env: ${name}. Check your .env.local / Vercel env`;
    if (process.env.NODE_ENV === 'production') throw new Error(msg);
    console.warn(msg); // dev: warn so the page still renders
  }
  return (val as T);
}

export function getFirebaseApp(): FirebaseApp {
  if (typeof window === 'undefined') throw new Error('Firebase Web SDK must run in the browser');
  if (_app) return _app;

  const cfg: FirebaseOptions = {
    apiKey: assertDefined(process.env.NEXT_PUBLIC_FB_API_KEY, 'NEXT_PUBLIC_FB_API_KEY'),
    authDomain: assertDefined(process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN, 'NEXT_PUBLIC_FB_AUTH_DOMAIN'),
    projectId: assertDefined(process.env.NEXT_PUBLIC_FB_PROJECT_ID, 'NEXT_PUBLIC_FB_PROJECT_ID'),
    storageBucket: assertDefined(process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET, 'NEXT_PUBLIC_FB_STORAGE_BUCKET'),
    appId: assertDefined(process.env.NEXT_PUBLIC_FB_APP_ID, 'NEXT_PUBLIC_FB_APP_ID'),
    ...(process.env.NEXT_PUBLIC_FB_SENDER_ID ? { messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER_ID } : {}),
    ...(process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID ? { measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID } : {}),
  };

  // Helpful one-time debug in dev (masks apiKey)
  if (process.env.NODE_ENV !== 'production' && !(window as any).__fb_cfg_logged) {
    const masked = (cfg.apiKey ?? '').replace(/^(.{6}).+(.{4})$/, '$1•••$2');
    console.log('[firebase] Web SDK config', { ...cfg, apiKey: masked });
    (window as any).__fb_cfg_logged = true;
  }

  _app = getApps().length ? getApp() : initializeApp(cfg);
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (!_auth) _auth = getAuth(getFirebaseApp());
  return _auth;
}

export function getFirestoreDb(): Firestore {
  if (!_db) _db = getFirestore(getFirebaseApp());
  return _db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!_storage) _storage = getStorage(getFirebaseApp());
  return _storage;
}