// services/firebaseLazy.ts
// Lazy-loaded Firebase for non-critical paths
// Use this instead of firebase.ts for pages that don't need Firebase immediately

import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";

let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;
let _initialized = false;

export async function getFirebaseAuth(): Promise<Auth> {
  if (!_auth) {
    const { auth } = await import("./firebase");
    _auth = auth;
  }
  return _auth;
}

export async function getFirebaseDb(): Promise<Firestore> {
  if (!_db) {
    const { db } = await import("./firebase");
    _db = db;
  }
  return _db;
}

export async function getFirebaseStorage(): Promise<FirebaseStorage> {
  if (!_storage) {
    const { storage } = await import("./firebase");
    _storage = storage;
  }
  return _storage;
}

export async function initializeFirebase() {
  if (_initialized) return { auth: _auth!, db: _db!, storage: _storage! };
  
  const { auth, db, storage } = await import("./firebase");
  _auth = auth;
  _db = db;
  _storage = storage;
  _initialized = true;
  
  return { auth, db, storage };
}

export function isFirebaseInitialized() {
  return _initialized;
}
