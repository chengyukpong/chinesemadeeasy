import type { Todo } from "../entities/todo";

// In-memory store for tests
const store = new Map<string, Todo[]>();
let currentUser: { uid: string; email: string } | null = null;
const snapshotListeners = new Map<string, (todos: Todo[]) => void>();

// Firestore mock helpers
export const firestoreMock = {
  addDoc: async (collectionName: string, data: Record<string, unknown>) => {
    if (!store.has(collectionName)) {
      store.set(collectionName, []);
    }
    const id = `mock-doc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const todos = store.get(collectionName) || [];
    todos.push({ id, ...data } as Todo);
    store.set(collectionName, todos);
    notifyListeners(collectionName);
    return { id };
  },

  deleteDoc: async (collectionName: string, docId: string) => {
    const todos = store.get(collectionName) || [];
    const filtered = todos.filter((t) => t.id !== docId);
    store.set(collectionName, filtered);
    notifyListeners(collectionName);
  },

  updateDoc: async (
    collectionName: string,
    docId: string,
    data: Record<string, unknown>
  ) => {
    const todos = store.get(collectionName) || [];
    const index = todos.findIndex((t) => t.id === docId);
    if (index !== -1) {
      todos[index] = { ...todos[index], ...data };
      store.set(collectionName, todos);
      notifyListeners(collectionName);
    }
  },

  query: (
    collectionName: string,
    filters: Array<{ field: string; value: unknown }>
  ) => {
    const todos = store.get(collectionName) || [];
    return todos.filter((todo) =>
      filters.every((f) => todo[f.field as keyof Todo] === f.value)
    );
  },

  subscribe: (
    collectionName: string,
    filters: Array<{ field: string; value: unknown }>,
    callback: (todos: Todo[]) => void
  ) => {
    const key = `${collectionName}-${JSON.stringify(filters)}`;
    snapshotListeners.set(key, callback);
    // Initial notification
    const todos = firestoreMock.query(collectionName, filters);
    callback(todos);
    return () => snapshotListeners.delete(key);
  },

  clear: () => {
    store.clear();
    snapshotListeners.clear();
  },

  getAll: (collectionName: string) => {
    return store.get(collectionName) || [];
  }
};

// Notify all listeners when data changes
function notifyListeners(collectionName: string) {
  snapshotListeners.forEach((callback, key) => {
    if (key.startsWith(collectionName)) {
      const filters = JSON.parse(
        key.slice(collectionName.length + 1)
      ) as Array<{ field: string; value: unknown }>;
      const todos = firestoreMock.query(collectionName, filters);
      callback(todos);
    }
  });
}

// Auth mock helpers
export const authMock = {
  signInWithGoogle: async () => {
    const mockUser = { uid: "test-user-123", email: "test@example.com" };
    currentUser = mockUser;
    return {
      user: {
        uid: "test-user-123",
        displayName: "Test User",
        photoURL: null,
        email: "test@example.com"
      }
    };
  },

  signOut: async () => {
    currentUser = null;
  },

  getCurrentUser: () => currentUser,

  setUser: (user: { uid: string; email: string } | null) => {
    currentUser = user;
  }
};

// Reset all mocks between tests
export const resetMocks = () => {
  firestoreMock.clear();
  currentUser = null;
};
