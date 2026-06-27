# NEXT PHASE PLAN: Phase 3

## Goal

Implement the core Domain Models within Prisma (`packages/database`), reflecting the architectural decisions from `04_DOMAIN_MODEL.md`.

## Execution Steps

1.  Define all Prisma schemas (`User`, `Product`, `Order`, `Quote`, `Material`, etc.).
2.  Implement the logical soft-delete architecture via Prisma Middleware (as outlined in Phase 1 docs).
3.  Implement the JSON structured audit logging for data mutations.
4.  Generate initial database migrations (`pnpm run db:push` / `db:migrate dev`) against the local Docker container.
5.  Validate relationships (One-to-Many, Many-to-Many) via Prisma Studio.

**Note:** We will not build the actual NestJS APIs for these models yet; the focus is purely on the Data Access Layer in this upcoming phase.
