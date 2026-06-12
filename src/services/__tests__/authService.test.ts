import { describe, it, expect, beforeEach, vi } from "vitest";
import { authMock, resetMocks } from "../../test/mocks";
import "../../test/firebaseMocks";

// Mock firebase module (path relative to this test file)
vi.mock("../firebase", () => ({
  db: { type: "firestore" },
  auth: { type: "auth" },
  todoService: null,
  authService: null
}));

// Import after mocks
import { AuthService } from "../authService";

describe("authService", () => {
  let authService: AuthService;

  beforeEach(() => {
    resetMocks();
    vi.clearAllMocks();
    authService = new AuthService({ type: "auth" } as never);
  });

  describe("signInWithGoogle, tier1", () => {
    it("returns user object on successful sign in", async () => {
      const user = await authService.signInWithGoogle();

      expect(user).toBeDefined();
      expect(user.uid).toBe("test-user-123");
      expect(user.email).toBe("test@example.com");
      expect(user.displayName).toBe("Test User");
    });
  });

  describe("signOut, tier1", () => {
    it("clears current user", async () => {
      await authService.signInWithGoogle();
      expect(authMock.getCurrentUser()).not.toBeNull();

      await authService.signOut();
      expect(authMock.getCurrentUser()).toBeNull();
    });
  });

  describe("onAuthChange, tier2", () => {
    it("fires callback with user state", () => {
      const callback = vi.fn();

      authService.onAuthChange(callback);

      expect(callback).toHaveBeenCalled();
    });
  });
});
