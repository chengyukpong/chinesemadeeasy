# Testing

Project-specific testing requirements and setup.

## Test Stack

- **Vitest** — test runner (Vite-native)
- **React Testing Library** — component testing
- **jsdom** — browser environment simulation
- **Custom mocks** — in-memory Firebase simulation

## Test Commands

```bash
npm run test                    # All tests (watch mode)
npm run test -- --run           # All tests (single run)
npm run test -- -t "tier1"      # Tier1 only
npm run test -- -t "tier2"      # Tier2 only
npm run test -- -t "addTodo"    # Filter by name
npm run test -- --reporter=verbose  # See all test names
```

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

## TDD Process

**Always use Test-Driven Development.** Every feature and bugfix follows this cycle:

### 1. RED — Write a Failing Test

- Write the test first, before any production code
- Run: `npm run test -- -t "test name" --run`
- Confirm it **FAILS** for the right reason (assertion error, not import/syntax error)
- If it can't import the module → create a minimal skeleton/stub first, then re-run
- Skeletons must not contain logic — they exist only so tests can run

### 2. WAIT — Human Reviews the Test

- Do not proceed until human approves the test
- Human verifies: test is correct, covers the right behavior, no over-testing

### 3. GREEN — Write Minimal Code to Pass

- Implement the smallest change to make the test pass
- Run: `npm run test -- -t "test name" --run`
- Confirm it **PASSES**
- No extra features, no edge cases not tested yet — just enough to pass

### 4. WAIT — Human Reviews the Implementation

- Do not proceed until human approves the implementation
- Human verifies: code is correct, minimal, follows conventions

### 5. REFACTOR — Clean Up (Optional)

- Improve code structure while keeping tests green
- Run tests again to confirm nothing broke
- Only refactor if the code needs it — don't refactor for the sake of it

### Rules

- No production code without a failing test first
- If test passes immediately → wrong test, fix it
- Never skip the human gate between phases
- Minimal code to pass only — no YAGNI
- Skeletons/stubs are OK if needed for imports, but must not contain logic

## Tier System

| Tier | Purpose |
|------|---------|
| `tier1` | Critical path — must pass for app to work |
| `tier2` | Important but secondary |
