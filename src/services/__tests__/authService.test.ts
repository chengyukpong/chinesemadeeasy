import { describe, it, expect, beforeEach, vi } from "vitest";
import { authMock, resetMocks } from "../../test/mocks";

// Mock Firebase auth module
vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn().mockImplementation(() => {
    return authMock.signInWithGoogle();
  }),
  signOut: vi.fn().mockImplementation(() => {
    return authMock.signOut();
  }),
  onAuthStateChanged: vi.fn().mockImplementation((auth, callback) => {
    // Simulate initial state
    callback(authMock.getCurrentUser());
    return () => {};
  }),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn()
}));

// Mock firebase module
vi.mock("../firebase", () => ({
  db: { type: "firestore" },
  auth: { type: "auth" }
}));

// Import after mocks
import { signInWithGoogle, signOut, onAuthChange } from "../authService";

describe("authService", () => {
  beforeEach(() => {
    resetMocks();
    vi.clearAllMocks();
  });

  describe("signInWithGoogle", () => {
    it("returns user object on successful sign in", async () => {
      const user = await signInWithGoogle();

      expect(user).toBeDefined();
      expect(user.uid).toBeDefined();
      expect(user.email).toBe("test@example.com");
    });
  });

  describe("signOut", () => {
    it("clears current user", async () => {
      await signInWithGoogle();
      expect(authMock.getCurrentUser()).not.toBeNull();

      await signOut();
      expect(authMock.getCurrentUser()).toBeNull();
    });
  });

  describe("onAuthChange", () => {
    it("fires callback with user state", () => {
      const callback = vi.fn();

      onAuthChange(callback);

      expect(callback).toHaveBeenCalled();
    });
  });
});
