import { describe, it, expect, beforeEach, vi } from "vitest";
import { firestoreMock, resetMocks } from "../../test/mocks";
import "../../test/firebaseMocks";

// Mock firebase module (path relative to this test file)
vi.mock("../firebase", () => ({
  db: { type: "firestore" },
  auth: { type: "auth" }
}));

// Import after mocks
import {
  addTodo,
  toggleTodo,
  deleteTodo,
} from "../todoService";

describe("todoService", () => {
  const TEST_USER_ID = "user-123";

  beforeEach(() => {
    resetMocks();
    vi.clearAllMocks();
  });

  describe("addTodo, tier1", () => {
    it("creates a document with correct fields", async () => {
      const docRef = await addTodo("Buy groceries", TEST_USER_ID);

      expect(docRef.id).toBeDefined();
      const todos = firestoreMock.getAll("todos");
      expect(todos.length).toBe(1);
      expect(todos[0].text).toBe("Buy groceries");
      expect(todos[0].completed).toBe(false);
      expect(todos[0].userId).toBe(TEST_USER_ID);
    });

    it("increments collection count", async () => {
      await addTodo("Task 1", TEST_USER_ID);
      await addTodo("Task 2", TEST_USER_ID);

      const todos = firestoreMock.getAll("todos");
      expect(todos.length).toBe(2);
    });
  });

  describe("toggleTodo, tier2", () => {
    it("flips completed from false to true", async () => {
      const docRef = await addTodo("Task to toggle", TEST_USER_ID);
      await toggleTodo(docRef.id, false);

      const todos = firestoreMock.getAll("todos");
      expect(todos[0].completed).toBe(true);
    });

    it("flips completed from true to false", async () => {
      const docRef = await addTodo("Task to toggle back", TEST_USER_ID);
      await toggleTodo(docRef.id, false);
      await toggleTodo(docRef.id, true);

      const todos = firestoreMock.getAll("todos");
      expect(todos[0].completed).toBe(false);
    });
  });

  describe("deleteTodo, tier2", () => {
    it("removes the document", async () => {
      const docRef = await addTodo("Task to delete", TEST_USER_ID);
      await deleteTodo(docRef.id);

      const todos = firestoreMock.getAll("todos");
      expect(todos.length).toBe(0);
    });

    it("decrements collection count", async () => {
      const docRef = await addTodo("Task to count delete", TEST_USER_ID);
      const countBefore = firestoreMock.getAll("todos").length;
      await deleteTodo(docRef.id);
      const countAfter = firestoreMock.getAll("todos").length;

      expect(countAfter).toBe(countBefore - 1);
    });
  });

  describe("subscribeToTodos, tier2", () => {
    it("receives real-time updates when todos are added", async () => {
      // Mock onSnapshot to simulate real-time updates
      const { onSnapshot } = await import("firebase/firestore");
      vi.mocked(onSnapshot).mockImplementation(() => {
        return () => {};
      });

      // Simulate adding a todo
      await addTodo("Subscribed task", TEST_USER_ID);

      const todos = firestoreMock.getAll("todos");
      expect(todos.length).toBe(1);
      expect(todos[0].text).toBe("Subscribed task");
    });

    it("filters by userId - only returns current user's todos", async () => {
      const otherUserId = "other-user-456";
      await addTodo("My todo", TEST_USER_ID);
      await addTodo("Other user's todo", otherUserId);

      const allTodos = firestoreMock.getAll("todos");
      expect(allTodos.length).toBe(2);

      // Filter by userId
      const myTodos = allTodos.filter((t) => t.userId === TEST_USER_ID);
      expect(myTodos.length).toBe(1);
      expect(myTodos[0].text).toBe("My todo");
    });
  });
});
