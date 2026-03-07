// ✏️ Replace ALL values below with your Firebase project config
// Get them from: Firebase Console → Project Settings → Your Apps → Web

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCzqVZm6kvbe3XWl3nUvfF_-bncI4Pe7j0",
  authDomain: "techno-96cd4.firebaseapp.com",
  projectId: "techno-96cd4",
  storageBucket: "techno-96cd4.firebasestorage.app",
  messagingSenderId: "806970744399",
  appId: "1:806970744399:web:3e73e75611e8840d12d43a",
  measurementId: "G-3WH151V7TN"
};


const app = initializeApp(firebaseConfig);

export const db      = getFirestore(app);
export const storage = getStorage(app);
export const auth    = getAuth(app);
export default app;
