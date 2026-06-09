import { create } from "zustand";
import type { Todo } from "../entities/todo";
import { addTodo as addTodoService, toggleTodo as toggleTodoService, deleteTodo as deleteTodoService, subscribeToTodos } from "../services/todoService";

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
    return subscribeToTodos(userId, (todos) => set({ todos }));
  },
  addTodo: async (text, userId) => {
    await addTodoService(text, userId);
  },
  toggleTodo: async (id, completed) => {
    await toggleTodoService(id, completed);
  },
  deleteTodo: async (id) => {
    await deleteTodoService(id);
  }
}));
