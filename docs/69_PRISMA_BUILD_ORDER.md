# PRISMA BUILD ORDER

The pipeline has been reconfigured to guarantee deterministic execution across all environments (Local and CI).

## Refined Turborepo Topology

1. **Explicit Output Paths:**
   - `packages/database/prisma/schema.prisma` now explicitly defines `output = "../src/generated/client"`.
   - `turbo.json` maps `"outputs": ["src/generated/client/**"]` for the `generate` task, guaranteeing remote cache hits.

2. **Absolute Topological Ordering:**
   - `build` and `typecheck` pipelines across the entire monorepo strictly depend on `generate` completing in the database package first.

## Modified Source Truth

`packages/database/src/index.ts` has been updated to import strictly from its deterministic local folder (`./generated/client`), rather than requesting `@prisma/client`.
The `apps/api` application continues to request `PrismaClient` from `@only3d/database`, completely oblivious to the generation strategy changes.
