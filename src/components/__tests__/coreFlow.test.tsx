import { describe, it, expect, beforeEach, vi } from "vitest";
import { firestoreMock, authMock, resetMocks } from "../../test/mocks";

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
  signInWithPopup: vi.fn().mockImplementation(() => {
    return authMock.signInWithGoogle();
  }),
  signOut: vi.fn().mockImplementation(() => {
    return authMock.signOut();
  }),
  onAuthStateChanged: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn()
}));

vi.mock("../../services/firebase", () => ({
  db: { type: "firestore" },
  auth: { type: "auth" }
}));

// Import after mocks
import {
  addTodo,
  toggleTodo,
  deleteTodo,
} from "../../services/todoService";
import { signInWithGoogle, signOut } from "../../services/authService";

describe("Core Flow: login → add todos → toggle → delete → logout", () => {
  beforeEach(() => {
    resetMocks();
    vi.clearAllMocks();
  });

  it("full flow: login → add todo1 → add todo2 → delete todo1 → toggle todo2 → logout", async () => {
    // Step 1: Login
    const user = await signInWithGoogle();
    expect(user).toBeDefined();
    expect(user.uid).toBeDefined();
    expect(authMock.getCurrentUser()).not.toBeNull();

    // Step 2: Add todo1
    const todo1Ref = await addTodo("Buy groceries", user.uid);
    expect(todo1Ref.id).toBeDefined();

    // Step 3: Add todo2
    const todo2Ref = await addTodo("Read book", user.uid);
    expect(todo2Ref.id).toBeDefined();

    // Step 4: Verify both todos exist
    let todos = firestoreMock.getAll("todos");
    expect(todos.length).toBe(2);
    expect(todos.some((t) => t.text === "Buy groceries")).toBe(true);
    expect(todos.some((t) => t.text === "Read book")).toBe(true);

    // Step 5: Delete todo1
    await deleteTodo(todo1Ref.id);
    todos = firestoreMock.getAll("todos");
    expect(todos.length).toBe(1);
    expect(todos[0].text).toBe("Read book");

    // Step 6: Toggle todo2 (mark complete)
    await toggleTodo(todo2Ref.id, false);
    todos = firestoreMock.getAll("todos");
    expect(todos[0].completed).toBe(true);

    // Step 7: Toggle todo2 back (unmark)
    await toggleTodo(todo2Ref.id, true);
    todos = firestoreMock.getAll("todos");
    expect(todos[0].completed).toBe(false);

    // Step 8: Logout
    await signOut();
    expect(authMock.getCurrentUser()).toBeNull();
  });
});
