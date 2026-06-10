# Architecture

Reusable architecture patterns and design decisions.

## Layered Architecture

```
Components (UI)  →  Stores (State)  →  Services (Logic)  →  Backend (Firebase)
```

Each layer only communicates with its immediate neighbor. Components never import from services directly.

## Project Structure

```
src/
  entities/         # Domain types
  services/         # Backend operations
  stores/           # State management
  components/       # UI components
  test/             # Test utilities
```

## Design Patterns

### Service Layer

Firebase SDK calls are wrapped in thin service functions. The SDK is never imported outside `services/`.

**Benefits:**
- Single point of backend initialization
- Replaceable backend logic
- Testable without real backend

### Zustand State Management

No React Context or Provider wrappers. Components call hooks directly to access state.

**Pattern:**
```ts
const { user, signIn } = useAuthStore();
const { todos, addTodo } = useTodosStore();
```

### Auth Gate

Root component conditionally renders based on auth state:
- Loading → show spinner
- Authenticated → show main app
- Not authenticated → show login

### Realtime Subscription

Firestore `onSnapshot` provides real-time updates:
1. Component mounts → `useEffect` subscribes
2. Data changes → callback fires → store updates → UI re-renders
3. Component unmounts → cleanup unsubscribes

**Critical:** Always return unsubscribe function from `useEffect`.

## Data Flow

### Authentication
```
User clicks sign in
  → authService.signInWithGoogle()
    → Firebase popup
      → onAuthStateChanged fires
        → store.set({ user })
          → App re-renders
```

### Todo CRUD
```
User action (add/toggle/delete)
  → store method calls service
    → service calls Firestore
      → onSnapshot listener fires
        → store.setTodos()
          → UI re-renders
```

## Testing Strategy

### Mocking Approach

Mock the backend entirely — no emulators, no network calls in tests.

**Two mock layers:**
1. In-memory store (`mocks.ts`) — simulates data operations
2. SDK mocks (`firebaseMocks.ts`) — wires SDK to in-memory store

### Tier System

Tests tagged by criticality in `describe` block names:

| Tier | Purpose |
|------|---------|
| `tier1` | Critical path — must pass for app to work |
| `tier2` | Important but secondary |

### Colocated Tests

Tests live in `__tests__/` folders next to the code they test.

```
src/
  services/
    __tests__/
      todoService.test.ts
  components/
    __tests__/
      coreFlow.test.tsx
```

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Zustand over Redux | Lighter, less boilerplate, no providers |
| Service layer | Testable Firebase abstraction |
| Mock-based testing | Fast, no external dependencies |
| Tier system | Quick verification of critical paths |
| No router | Single-page app with auth gate is sufficient |
| Runtime config loading | Single build for all environments, no rebuild needed |
