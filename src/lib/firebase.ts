import { initializeApp } from "firebase/app";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable, type Readable, derived } from "svelte/store";

const firebaseConfig = {
  apiKey: "AIzaSyCQkxBxOfcNXmCyP9_RyDCrmPcgXOMvn1c",
  authDomain: "svelte-fireship-course-d0855.firebaseapp.com",
  projectId: "svelte-fireship-course-d0855",
  storageBucket: "svelte-fireship-course-d0855.appspot.com",
  messagingSenderId: "814934463636",
  appId: "1:814934463636:web:0bbbdc8f1229bad87d1081",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

/**
 * @returns a store with the current firebase user
 */
function userStore() {
  let unsubscribe: () => void;

  if (!auth || !globalThis.window) {
    console.warn("Auth is not initialized or not in browser");
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe,
    };
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
  };
}

export const user = userStore();

/**
 * Reusable universal Firestore store
 * @param {string} path
 * @returns a store with realtime updates on document data
 */
// <T> is a TypeScript generic, that lets us specify and enforce the given type. See userData for utilization
export function docStore<T>(path: string) {
  let unsubscribe: () => void;

  const docRef = doc(db, path);

  const { subscribe } = writable<T | null>(null, (set) => {
    unsubscribe = onSnapshot(docRef, (snapshot) => {
      set((snapshot.data() as T) ?? null);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
    ref: docRef,
    id: docRef.id,
  };
}

/**
 * A derived store to automatically subscribe to both the user’s auth state and Firestore data at the same time.
 */

interface UserData {
  username: string;
  bio: string;
  photoURL: string;
  links: any[];
  published: boolean;
}

export const userData: Readable<UserData | null> = derived(
  user,
  ($user, set) => {
    if ($user) {
      return docStore<UserData>(`/users/${$user.uid}`).subscribe(set);
    } else {
      set(null);
    }
  }
);
