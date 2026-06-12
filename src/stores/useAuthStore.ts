import { create } from "zustand";
import { getAuthService } from "../services/container";
import type { TodoUser } from "../entities/user";

interface AuthState {
  user: TodoUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async () => {
    await getAuthService().signInWithGoogle();
  },
  signOut: async () => {
    await getAuthService().signOut();
  },
  init: () => {
    getAuthService().onAuthChange((user) => {
      set({ user, loading: false });
    });
  }
}));
