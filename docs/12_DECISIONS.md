# 12 Architecture Decision Records (ADRs)

This log is the permanent engineering journal. New architectural decisions must be proposed, debated, and logged here before implementation.

---

## ADR 001: Strict Monorepo Architecture

**Status:** Accepted
**Date:** 2026-06-27

- **Context:** Only3D requires extreme consistency between the mathematical algorithms calculated on the backend and the optimistic UI updates on the frontend.
- **Decision:** We will use Turborepo to manage a monorepo containing Next.js (`apps/web`), NestJS (`apps/api`), and shared logic (`packages/database`, `packages/utils`, `packages/types`).
- **Consequences:**
  - _Positive:_ 100% type safety across the network boundary.
  - _Negative:_ Longer initial CI/CD pipeline setup.

---

## ADR 002: NestJS for Backend API

**Status:** Accepted
**Date:** 2026-06-27

- **Context:** Next.js Route Handlers are great for simple CRUD, but Only3D requires complex dependency injection, cron jobs (for cleaning up abandoned R2 files), and robust webhook validation.
- **Decision:** All business logic will be isolated in a dedicated NestJS application.
- **Consequences:**
  - _Positive:_ Highly testable, enterprise-grade codebase capable of scaling to hundreds of thousands of orders.
  - _Negative:_ Requires managing two deployment targets (Vercel + Railway).

---

## ADR 003: PostgreSQL over NoSQL

**Status:** Accepted
**Date:** 2026-06-27

- **Context:** The relationship between a specific material, its available colors, the printers capable of extruding that material, and the dynamic pricing rules is highly relational.
- **Decision:** Use PostgreSQL managed via Prisma ORM.
- **Consequences:**
  - _Positive:_ Absolute data integrity. Impossible to accidentally assign an order to a printer that doesn't support the requested material.
  - _Negative:_ Schema migrations require strict management to prevent downtime.

---

## ADR 004: Soft Deletes vs. Hard Deletes

**Status:** Accepted
**Date:** 2026-06-27

- **Context:** If an Admin deletes a "Material" from the database, what happens to an Order from 2 years ago that used that Material?
- **Decision:** We will not use `DELETE` operations on core business entities (Materials, Products, Pricing Rules). We will use an `isActive` boolean (Soft Delete).
- **Consequences:**
  - _Positive:_ Preserves perfect financial and historical records.
  - _Negative:_ Database will grow slightly faster; application logic must always filter `WHERE isActive = true` for public queries.
