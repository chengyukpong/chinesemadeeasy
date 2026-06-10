import { describe, it, expect, beforeEach, vi } from "vitest";
import { authMock, resetMocks } from "../../test/mocks";
import "../../test/firebaseMocks";

// Mock firebase module (path relative to this test file)
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

  describe("signInWithGoogle, tier1", () => {
    it("returns user object on successful sign in", async () => {
      const user = await signInWithGoogle();

      expect(user).toBeDefined();
      expect(user.uid).toBeDefined();
      expect(user.email).toBe("test@example.com");
    });
  });

  describe("signOut, tier1", () => {
    it("clears current user", async () => {
      await signInWithGoogle();
      expect(authMock.getCurrentUser()).not.toBeNull();

      await signOut();
      expect(authMock.getCurrentUser()).toBeNull();
    });
  });

  describe("onAuthChange, tier2", () => {
    it("fires callback with user state", () => {
      const callback = vi.fn();

      onAuthChange(callback);

      expect(callback).toHaveBeenCalled();
    });
  });
});
