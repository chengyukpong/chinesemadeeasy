import { describe, it, expect, beforeEach, vi } from "vitest";
import { firestoreMock, authMock, resetMocks } from "../../test/mocks";
import "../../test/firebaseMocks";

// Mock firebase module (path relative to this test file)
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

describe("Core Flow, tier1", () => {
  beforeEach(() => {
    resetMocks();
    vi.clearAllMocks();
  });

  it("full flow: login → add todo1 → add todo2 → delete todo1 → toggle todo2 → logout", async () => {
    // Step 1: Login
    const user = await signInWithGoogle() as unknown as { uid: string; email: string };
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
