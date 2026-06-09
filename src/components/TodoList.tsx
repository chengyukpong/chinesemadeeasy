import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import type { Todo } from "../entities/todo";
import { addTodo, toggleTodo, deleteTodo, subscribeToTodos } from "../services/todoService";
import { signOut } from "../services/authService";

interface Props {
  user: User;
}

export function TodoList({ user }: Props) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToTodos(user.uid, setTodos);
    return () => unsubscribe();
  }, [user.uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await addTodo(newTodo.trim(), user.uid);
    setNewTodo("");
  };

  return (
    <div className="app">
      <header>
        <h1>Todo List</h1>
        <div className="user-info">
          <img src={user.photoURL || ""} alt="" referrerPolicy="no-referrer" />
          <span>{user.displayName}</span>
          <button onClick={signOut}>Sign out</button>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="add-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button type="submit">Add</button>
      </form>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, todo.completed)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
