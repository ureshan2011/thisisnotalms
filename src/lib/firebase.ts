import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialise Firebase only when a real config is present. Public builds
// (e.g. the XR Explorer page on GitHub Pages) ship without Firebase env
// vars; initialising there throws auth/invalid-api-key and crashes the
// whole bundle before React can render. Guarding keeps those pages working
// while the full platform still initialises normally when configured.
const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : undefined;

export const auth = (app ? getAuth(app) : undefined) as Auth;
export const db   = (app ? getFirestore(app) : undefined) as Firestore;
