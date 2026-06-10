import { useEffect, useState } from "react";
import { initFirebase } from "./services/firebase";
import { useAuthStore } from "./stores/useAuthStore";
import { Login } from "./components/Login";
import { TodoList } from "./components/TodoList";
import "./App.css";

function App() {
  const { user, loading, init } = useAuthStore();
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    initFirebase().then(() => {
      setFirebaseReady(true);
      init();
    });
  }, [init]);

  if (!firebaseReady || loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? <TodoList /> : <Login />;
}

export default App;
