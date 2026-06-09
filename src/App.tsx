import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { onAuthChange } from "./services/authService";
import { Login } from "./components/Login";
import { TodoList } from "./components/TodoList";
import "./App.css";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? <TodoList user={user} /> : <Login />;
}

export default App;
