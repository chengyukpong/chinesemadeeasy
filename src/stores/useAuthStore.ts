import { create } from "zustand";
import type { User } from "firebase/auth";
import { signInWithGoogle, signOut as firebaseSignOut, onAuthChange } from "../services/authService";

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async () => {
    await signInWithGoogle();
  },
  signOut: async () => {
    await firebaseSignOut();
  },
  init: () => {
    onAuthChange((user) => {
      set({ user, loading: false });
    });
  }
}));
