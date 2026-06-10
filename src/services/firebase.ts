import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

export async function initFirebase() {
  const res = await fetch("/config.json");
  const config = await res.json();
  app = initializeApp(config.firebase);
  db = getFirestore(app);
  auth = getAuth(app);
  return { db, auth };
}

export { db, auth };
