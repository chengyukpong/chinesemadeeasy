import { describe, it, expect, beforeEach, vi } from "vitest";
import { firestoreMock, authMock, resetMocks } from "../../test/mocks";
import "../../test/firebaseMocks";

// Mock firebase module (path relative to this test file)
vi.mock("../../services/firebase", () => ({
  db: { type: "firestore" },
  auth: { type: "auth" },
  todoService: null,
  authService: null
}));

// Import after mocks
import { TodoService } from "../../services/todoService";
import { AuthService } from "../../services/authService";

describe("Core Flow, tier1", () => {
  let todoService: TodoService;
  let authService: AuthService;

  beforeEach(() => {
    resetMocks();
    vi.clearAllMocks();
    todoService = new TodoService({ type: "firestore" } as never);
    authService = new AuthService({ type: "auth" } as never);
  });

  it("full flow: login → add todo1 → add todo2 → delete todo1 → toggle todo2 → logout", async () => {
    // Step 1: Login
    const user = await authService.signInWithGoogle();
    expect(user).toBeDefined();
    expect(user.uid).toBeDefined();
    expect(authMock.getCurrentUser()).not.toBeNull();

    // Step 2: Add todo1
    const todo1Id = await todoService.addTodo("Buy groceries", user.uid);
    expect(todo1Id).toBeDefined();
    expect(typeof todo1Id).toBe("string");

    // Step 3: Add todo2
    const todo2Id = await todoService.addTodo("Read book", user.uid);
    expect(todo2Id).toBeDefined();
    expect(typeof todo2Id).toBe("string");

    // Step 4: Verify both todos exist
    let todos = firestoreMock.getAll("todos");
    expect(todos.length).toBe(2);
    expect(todos.some((t) => t.text === "Buy groceries")).toBe(true);
    expect(todos.some((t) => t.text === "Read book")).toBe(true);

    // Step 5: Delete todo1
    await todoService.deleteTodo(todo1Id);
    todos = firestoreMock.getAll("todos");
    expect(todos.length).toBe(1);
    expect(todos[0].text).toBe("Read book");

    // Step 6: Toggle todo2 (mark complete)
    await todoService.toggleTodo(todo2Id, false);
    todos = firestoreMock.getAll("todos");
    expect(todos[0].completed).toBe(true);

    // Step 7: Toggle todo2 back (unmark)
    await todoService.toggleTodo(todo2Id, true);
    todos = firestoreMock.getAll("todos");
    expect(todos[0].completed).toBe(false);

    // Step 8: Logout
    await authService.signOut();
    expect(authMock.getCurrentUser()).toBeNull();
  });
});
