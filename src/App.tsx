import { useEffect, useState } from "react";
import { initContainer } from "./services/container";
import { useAuthStore } from "./stores/useAuthStore";
import { Login } from "./components/Login";
import { TodoList } from "./components/TodoList";
import "./App.css";

function App(): React.JSX.Element {
  const { user, loading, init } = useAuthStore();
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    initContainer().then(() => {
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
