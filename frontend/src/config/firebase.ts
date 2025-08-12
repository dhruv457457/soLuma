import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

let readyPromise: Promise<void> | null = null;

export function ensureFirebaseAuth(): Promise<void> {
  if (readyPromise) return readyPromise;

  readyPromise = new Promise<void>((resolve, reject) => {
    let resolved = false;
    const stop = onAuthStateChanged(auth, async (user) => {
      if (user && !resolved) {
        resolved = true;
        stop();
        resolve();
      } else if (!user) {
        try {
          await signInAnonymously(auth);
        } catch (e) {
          if (!resolved) {
            resolved = true;
            stop();
            reject(e);
          }
        }
      }
    });
    setTimeout(() => {
      if (!resolved) console.warn("ensureFirebaseAuth: still waiting after 8s");
    }, 8000);
  });

  return readyPromise;
}
