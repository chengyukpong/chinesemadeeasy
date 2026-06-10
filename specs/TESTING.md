# Testing

Project-specific testing requirements and setup.

## Test Stack

- **Vitest** — test runner (Vite-native)
- **React Testing Library** — component testing
- **jsdom** — browser environment simulation
- **Custom mocks** — in-memory Firebase simulation

## Test File Locations

```
src/
  test/
    setup.ts            # jest-dom matchers
    mocks.ts            # In-memory Firestore + Auth store
    firebaseMocks.ts    # vi.mock() for Firebase SDK
  services/
    __tests__/
      todoService.test.ts   # 8 tests
      authService.test.ts   # 3 tests
  components/
    __tests__/
      coreFlow.test.tsx     # 1 test
```

## Mock Files

| File | Purpose |
|------|---------|
| `src/test/mocks.ts` | In-memory store with `firestoreMock`, `authMock`, `resetMocks()` |
| `src/test/firebaseMocks.ts` | `vi.mock("firebase/firestore")` and `vi.mock("firebase/auth")` |

## Test Commands

```bash
npm run test                    # All tests (watch mode)
npm run test -- --run           # All tests (single run)
npm run test -- -t "tier1"      # Tier1 only (5 tests)
npm run test -- -t "tier2"      # Tier2 only (7 tests)
npm run test -- -t "addTodo"    # Filter by name
npm run test -- --reporter=verbose  # See all test names
```

## Current Test Inventory

| File | Tier | Tests |
|------|------|-------|
| `todoService.test.ts` | tier1 | addTodo (2) |
| `todoService.test.ts` | tier2 | toggleTodo (2), deleteTodo (2), subscribeToTodos (2) |
| `authService.test.ts` | tier1 | signInWithGoogle (1), signOut (1) |
| `authService.test.ts` | tier2 | onAuthChange (1) |
| `coreFlow.test.tsx` | tier1 | Full flow (1) |

**Total: 12 tests (5 tier1, 7 tier2)**

## Writing New Tests

1. Create `__tests__/` folder next to the code
2. Set up mocks:
   ```ts
   import { describe, it, expect, beforeEach, vi } from "vitest";
   import { resetMocks } from "../../test/mocks";
   import "../../test/firebaseMocks";

   vi.mock("../firebase", () => ({
     db: { type: "firestore" },
     auth: { type: "auth" }
   }));

   import { myFunction } from "../myService";
   ```
3. Add tier tag to `describe`:
   ```ts
   describe("featureName, tier1", () => {
     beforeEach(() => {
       resetMocks();
       vi.clearAllMocks();
     });

     it("does something", async () => {
       // test logic
     });
   });
   ```

## Firebase Mock Setup Order

1. Import `firebaseMocks` (mocks Firebase SDK)
2. Mock app's `firebase.ts` (path relative to test file)
3. Import functions under test

**Why:** `vi.mock()` is hoisted to top. Imports after mocks use the mocked modules.
