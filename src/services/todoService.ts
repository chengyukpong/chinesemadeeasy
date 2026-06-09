import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where
} from "firebase/firestore";
import { db } from "./firebase";
import type { Todo } from "../entities/todo";

export const addTodo = (text: string, userId: string) =>
  addDoc(collection(db, "todos"), {
    text,
    completed: false,
    createdAt: new Date(),
    userId
  });

export const toggleTodo = (id: string, completed: boolean) =>
  updateDoc(doc(db, "todos", id), { completed: !completed });

export const deleteTodo = (id: string) =>
  deleteDoc(doc(db, "todos", id));

export const subscribeToTodos = (
  userId: string,
  callback: (todos: Todo[]) => void
) => {
  const q = query(
    collection(db, "todos"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const todos: Todo[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      text: doc.data().text,
      completed: doc.data().completed,
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));
    callback(todos);
  });
};
