import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
  type Firestore
} from "firebase/firestore";
import { singleton, inject } from "tsyringe";
import type { Todo } from "../entities/todo";
import type { Unsubscribe } from "../entities/types";

@singleton()
export class TodoService {
  private db: Firestore;

  constructor(@inject("Firestore") db: Firestore) {
    this.db = db;
  }

  async addTodo(text: string, userId: string): Promise<string> {
    const docRef = await addDoc(collection(this.db, "todos"), {
      text,
      completed: false,
      createdAt: new Date(),
      userId
    });
    return docRef.id;
  }

  async toggleTodo(id: string, completed: boolean): Promise<void> {
    await updateDoc(doc(this.db, "todos", id), { completed: !completed });
  }

  async deleteTodo(id: string): Promise<void> {
    await deleteDoc(doc(this.db, "todos", id));
  }

  subscribeToTodos(
    userId: string,
    callback: (todos: Todo[]) => void
  ): Unsubscribe {
    const q = query(
      collection(this.db, "todos"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snapshot) => {
      const todos: Todo[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        completed: doc.data().completed,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        userId: doc.data().userId
      }));
      callback(todos);
    });
  }
}
