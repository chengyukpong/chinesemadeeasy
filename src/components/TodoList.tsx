import { useState, useEffect, type SubmitEvent } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useTodosStore } from "../stores/useTodosStore";

export function TodoList() {
  const { user, signOut } = useAuthStore();
  const { todos, subscribe, addTodo, toggleTodo, deleteTodo } = useTodosStore();
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribe(user.uid);
    return () => unsubscribe();
  }, [user, subscribe]);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !user) return;
    await addTodo(newTodo.trim(), user.uid);
    setNewTodo("");
  };

  return (
    <div className="app">
      <header>
        <h1>Todo List</h1>
        <div className="user-info">
          <img src={user?.photoURL || ""} alt="" referrerPolicy="no-referrer" />
          <span>{user?.displayName}</span>
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
