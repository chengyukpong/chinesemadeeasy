import { signInWithGoogle } from "../services/authService";

export function Login() {
  return (
    <div className="login">
      <h1>Todo List</h1>
      <p>Sign in to manage your todos</p>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}
