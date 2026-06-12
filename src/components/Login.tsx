import { useAuthStore } from "../stores/useAuthStore";

export function Login(): React.JSX.Element {
  const { signIn } = useAuthStore();

  return (
    <div className="login">
      <h1>Todo List</h1>
      <p>Sign in to manage your todos</p>
      <button onClick={signIn}>Sign in with Google</button>
    </div>
  );
}
