import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { singleton } from "tsyringe";

@singleton()
export class FirebaseService {
  private app!: FirebaseApp;
  private db!: Firestore;
  private auth!: Auth;

  async init(): Promise<void> {
    const res = await fetch("/config.json");
    const config = await res.json();
    this.app = initializeApp(config.firebase);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }

  getDb(): Firestore {
    return this.db;
  }

  getAuth(): Auth {
    return this.auth;
  }
}
