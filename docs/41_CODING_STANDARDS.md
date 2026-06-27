# 41 Coding Standards & Conventions

## 1. Purpose

Ensures the Only3D codebase looks like it was written by a single senior engineer, regardless of team size.

## 2. Scope

Covers TypeScript rules, ESLint configuration, file naming, and state management.

## 3. Responsibilities

- **Husky / lint-staged:** Enforces these rules on every `git commit`.

## 4. Dependencies

- `09_DESIGN_SYSTEM.md` (For UI constraints)

## 5. Core Conventions

### 5.1 Naming Rules

- **React Components:** `PascalCase.tsx` (e.g., `QuoteConfigurator.tsx`).
- **Hooks:** `camelCase.ts` (e.g., `usePricing.ts`).
- **NestJS Services/Controllers:** `kebab-case.ts` (e.g., `quote-engine.service.ts`).
- **Database Tables (Prisma):** PascalCase for models (`PricingRule`), camelCase for fields (`costPerKg`).

### 5.2 State Management (React)

- **Server State (API Data):** Use `TanStack Query` exclusively. Do not store API responses in Redux or `useState`.
- **Client State (UI toggles):** Use Zustand for global UI state, `useState` for local component state.
- **URL State:** The URL is the source of truth for the Admin dashboard filters (e.g., `?status=PENDING&page=2`).

### 5.3 TypeScript Strictness

- `"strict": true` is non-negotiable.
- `any` is banned. Use `unknown` and runtime validation (Zod) instead.
- `@ts-ignore` is banned. Use `@ts-expect-error` and provide a detailed comment.

## 6. Failure Scenarios

- A developer attempts to commit code containing `console.log` or `any`. Husky pre-commit hooks run ESLint, which automatically fails the commit.

## 7. Future Scalability

- Standardizing around these strict types allows easy onboarding of junior engineers who can rely on TypeScript to catch business logic errors.

## 8. Risks

- **CSS Bloat:** Using Tailwind arbitrarily. _Mitigation:_ Developers must only use the specific spacing/color tokens defined in `09_DESIGN_SYSTEM.md` via `cva`.

## 9. Open Questions

- None.

## 10. Cross References

- `19_COMPONENT_LIBRARY.md`
