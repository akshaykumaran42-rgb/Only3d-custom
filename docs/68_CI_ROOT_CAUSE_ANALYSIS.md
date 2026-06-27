# CI ROOT CAUSE ANALYSIS

## The Defect

GitHub Actions consistently failed the build with the following TypeScript errors during `api` typechecking:

- `@prisma/client has no exported member PrismaClient`
- `@only3d/database declares PrismaClient locally but it is not exported`

This occurred exclusively in CI and could not be reproduced via a standard local build.

## Root Cause

The failure was caused by a devastating combination of `pnpm`'s hoisted symlink architecture and the default Prisma Client output path, colliding within a Turborepo cache pipeline:

1. **Default Prisma Hoisting:** By default, Prisma attempts to generate the client into `node_modules/.prisma/client`. In a `pnpm` monorepo, it resolves the nearest `@prisma/client` installation, which `pnpm` physically stores in the global, hoisted root (`node_modules/.pnpm/@prisma+client.../node_modules/.prisma/client`).
2. **Turborepo Cache Misses:** The `turbo.json` configuration instructed Turborepo to cache `node_modules/.prisma/client/**` inside `packages/database`. Because Prisma hoisted the output to the workspace root, Turborepo found nothing to cache (`WARNING: no output files found`).
3. **CI Dependency Execution:** In GitHub Actions, when `pnpm turbo run typecheck` executed, it bypassed the local `generate` hook because Turborepo assumed the generation cache was either empty or invalid, but the global `.prisma/client` path wasn't successfully linked back into the frozen lockfile installation. The result was that `apps/api` requested `@only3d/database`, which queried `@prisma/client`, which contained only a stub instead of the fully generated client typings.

## Resolution

The architecture has been upgraded to **entirely abandon the invisible `node_modules/.prisma/client` path**.
Prisma now generates its client explicitly into `packages/database/src/generated/client`.
This completely bypasses `pnpm` hoisting magic, guarantees deterministic topological builds, and ensures Turborepo flawlessly caches the exact generated typescript source code.
