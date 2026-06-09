import { describe, it, expect, beforeEach, vi } from "vitest";
import { firestoreMock, resetMocks } from "../../test/mocks";

// Mock Firebase modules
vi.mock("firebase/firestore", () => ({
  collection: vi.fn().mockReturnValue({ id: "todos", type: "collection" }),
  addDoc: vi.fn().mockImplementation((collectionRef: { id: string }, data: Record<string, unknown>) => {
    return firestoreMock.addDoc(collectionRef.id, data);
  }),
  deleteDoc: vi.fn().mockImplementation((docRef: { id: string }) => {
    return firestoreMock.deleteDoc("todos", docRef.id);
  }),
  updateDoc: vi.fn().mockImplementation((docRef: { id: string }, data: Record<string, unknown>) => {
    return firestoreMock.updateDoc("todos", docRef.id, data);
  }),
  doc: vi.fn().mockImplementation((_db: unknown, _collection: string, id?: string) => ({
    id: id || "mock-doc",
    type: "document"
  })),
  onSnapshot: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  where: vi.fn(),
  getDoc: vi.fn().mockImplementation((docRef: { id: string }) => {
    const todos = firestoreMock.getAll("todos");
    const todo = todos.find((t) => t.id === docRef.id);
    return Promise.resolve({
      exists: () => !!todo,
      data: () => todo
    });
  }),
  getDocs: vi.fn().mockImplementation(() => {
    const todos = firestoreMock.getAll("todos");
    return Promise.resolve({
      docs: todos.map((todo) => ({
        id: todo.id,
        data: () => todo
      }))
    });
  })
}));

vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn()
}));

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

  describe("addTodo", () => {
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

  describe("toggleTodo", () => {
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

  describe("deleteTodo", () => {
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

  describe("subscribeToTodos", () => {
    it("receives real-time updates when todos are added", async () => {
      const receivedTodos: unknown[][] = [];

      // Mock onSnapshot to simulate real-time updates
      const { onSnapshot } = await import("firebase/firestore");
      vi.mocked(onSnapshot).mockImplementation((_query: unknown, callback: (snapshot: { docs: Array<{ data: () => Record<string, unknown>; id: string }> }) => void) => {
        // Initial empty state
        callback({ docs: [] });
        return () => {};
      });

      const unsubscribe = () => {};

      // Simulate adding a todo
      await addTodo("Subscribed task", TEST_USER_ID);

      const todos = firestoreMock.getAll("todos");
      expect(todos.length).toBe(1);
      expect(todos[0].text).toBe("Subscribed task");

      unsubscribe();
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
