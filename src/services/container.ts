import "reflect-metadata";
import { container } from "tsyringe";
import { FirebaseService } from "./firebase";
import { TodoService } from "./todoService";
import { AuthService } from "./authService";

export async function initContainer(): Promise<void> {
  const firebaseService = container.resolve(FirebaseService);
  await firebaseService.init();

  container.register("Firestore", { useValue: firebaseService.getDb() });
  container.register("Auth", { useValue: firebaseService.getAuth() });
}

export function getTodoService(): TodoService {
  return container.resolve(TodoService);
}

export function getAuthService(): AuthService {
  return container.resolve(AuthService);
}
