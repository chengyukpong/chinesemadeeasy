import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, type Auth } from "firebase/auth";
import { injectable, inject } from "tsyringe";
import type { TodoUser } from "../entities/user";
import type { Unsubscribe } from "../entities/types";

@injectable()
export class AuthService {
  private auth: Auth;
  private googleProvider: GoogleAuthProvider;

  constructor(@inject("Auth") auth: Auth) {
    this.auth = auth;
    this.googleProvider = new GoogleAuthProvider();
  }

  async signInWithGoogle(): Promise<TodoUser> {
    const credential = await signInWithPopup(this.auth, this.googleProvider);
    const { uid, displayName, photoURL, email } = credential.user;
    return { uid, displayName, photoURL, email };
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(this.auth);
  }

  onAuthChange(callback: (user: TodoUser | null) => void): Unsubscribe {
    return onAuthStateChanged(this.auth, (firebaseUser) => {
      if (firebaseUser) {
        const { uid, displayName, photoURL, email } = firebaseUser;
        callback({ uid, displayName, photoURL, email });
      } else {
        callback(null);
      }
    });
  }
}
