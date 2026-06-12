import { create } from "zustand";
import type { Todo } from "../entities/todo";
import { getTodoService } from "../services/container";

interface TodosState {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  subscribe: (userId: string) => () => void;
  addTodo: (text: string, userId: string) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export const useTodosStore = create<TodosState>((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
  subscribe: (userId) => {
    return getTodoService().subscribeToTodos(userId, (todos) => set({ todos }));
  },
  addTodo: async (text, userId) => {
    await getTodoService().addTodo(text, userId);
  },
  toggleTodo: async (id, completed) => {
    await getTodoService().toggleTodo(id, completed);
  },
  deleteTodo: async (id) => {
    await getTodoService().deleteTodo(id);
  }
}));
