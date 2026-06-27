# 42 Repository Standards

## 1. Purpose

Defines the structure of the Turborepo monorepo, managing dependencies, and branch workflows.

## 2. Scope

Covers folder structure, package management (pnpm), and Git flow.

## 3. Responsibilities

- **Turborepo:** Orchestrates the build cache to ensure fast CI.
- **pnpm:** Enforces strict dependency hoisting.

## 4. Dependencies

- `11_ROADMAP.md` (Execution relies on this structure)

## 5. Monorepo Architecture Diagram

```text
only3d-monorepo/
├── apps/
│   ├── web/           # Next.js (Customer + Admin UI)
│   └── api/           # NestJS (Core Business Logic)
├── packages/
│   ├── database/      # Prisma schema and generated client
│   ├── ui/            # React/Tailwind Component Library
│   ├── utils/         # Shared pure math functions (Quote Engine)
│   ├── types/         # Shared TypeScript interfaces
│   └── eslint-config/ # Global linting rules
├── .husky/            # Git hooks
├── turbo.json         # Build pipeline definition
└── pnpm-workspace.yaml
```

## 6. Git Branching Strategy (Trunk-Based)

- `main` is strictly protected. Commits directly to `main` are blocked.
- Engineers branch off `main` -> `feature/quote-engine-v2`.
- PRs require 1 approving review and passing CI (Tests + Lint + Build) before merging.
- _Rebase and Merge_ is preferred to keep a linear, readable git history.

## 7. Failure Scenarios

- Circular dependencies between packages (e.g., `utils` imports from `database`, and `database` imports from `utils`). _Mitigation:_ ESLint rule `import/no-circular` is enforced globally.

## 8. Future Scalability

- If we build a native mobile app (React Native), we simply add `apps/mobile/` and it instantly inherits `packages/ui` and `packages/types`.

## 9. Risks

- **Phantom Dependencies:** `apps/web` using a library installed in `packages/ui` without explicitly declaring it in its own `package.json`. _Mitigation:_ `pnpm` natively prevents this via strict symlinking.

## 10. Open Questions

- None.

## 11. Cross References

- `15_DEPLOYMENT_PIPELINE.md`
