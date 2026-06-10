# Agent Instructions

Developer instructions for working with this codebase.

## Specs

- [Project Details](specs/PROJECT.md) — Firebase config, dependencies, deployment
- [Architecture](specs/ARCHITECTURE.md) — Design patterns, data flow, decisions
- [Testing](specs/TESTING.md) — Test setup, commands, how to write tests

## NPM Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (watch mode) |

## Code Conventions

- **TypeScript strict mode** — no `any` types
- **Named exports** — avoid default exports
- **Functional components** — no class components
- **Zustand hooks** — use `useXxxStore()` pattern
- **Service layer** — never import Firebase directly in components/stores

## Commit Conventions

- Use imperative mood ("add feature" not "added feature")
- Keep subject line under 72 characters
- Reference issues when applicable

## Workflow

1. Create feature branch
2. Make changes
3. Run `npm run build` to verify no errors
4. Run `npm run test -- -t "tier1"` to verify critical paths
5. Commit with descriptive message
6. Push and create PR
