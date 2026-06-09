import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { Login } from "./components/Login";
import { TodoList } from "./components/TodoList";
import "./App.css";

function App() {
  const { user, loading, init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? <TodoList /> : <Login />;
}

export default App;
