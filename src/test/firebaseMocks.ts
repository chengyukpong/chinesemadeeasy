import { vi } from "vitest";
import { firestoreMock, authMock } from "./mocks";

vi.mock("firebase/firestore", () => ({
  collection: vi.fn().mockReturnValue({ id: "todos", type: "collection" }),
  addDoc: vi.fn().mockImplementation((ref: { id: string }, data: Record<string, unknown>) => {
    return firestoreMock.addDoc(ref.id, data);
  }),
  deleteDoc: vi.fn().mockImplementation((ref: { id: string }) => {
    return firestoreMock.deleteDoc("todos", ref.id);
  }),
  updateDoc: vi.fn().mockImplementation((ref: { id: string }, data: Record<string, unknown>) => {
    return firestoreMock.updateDoc("todos", ref.id, data);
  }),
  doc: vi.fn().mockImplementation((_db: unknown, _col: string, id?: string) => ({
    id: id || "mock-doc",
    type: "document"
  })),
  onSnapshot: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  where: vi.fn(),
  getDoc: vi.fn().mockImplementation((ref: { id: string }) => {
    const todos = firestoreMock.getAll("todos");
    const todo = todos.find((t) => t.id === ref.id);
    return Promise.resolve({
      exists: () => !!todo,
      data: () => todo
    });
  }),
  getDocs: vi.fn().mockImplementation(() => {
    const todos = firestoreMock.getAll("todos");
    return Promise.resolve({
      docs: todos.map((t) => ({
        id: t.id,
        data: () => t
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
  onAuthStateChanged: vi.fn().mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
    callback(authMock.getCurrentUser());
    return () => {};
  }),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn()
}));
