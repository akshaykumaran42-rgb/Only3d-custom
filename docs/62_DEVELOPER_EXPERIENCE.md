# DEVELOPER EXPERIENCE

A developer can now effectively clone the repository and begin contributing without performing obscure manual workarounds or hunting for script errors.

## Clean Clone Workflow

From a clean repository state, the following workflow is 100% verified to pass asynchronously:

```bash
git clone <repository>
cd only3d-monorepo

# Install dependencies and link the workspace
pnpm install

# (Optional) Generate the database typings (pnpm db:generate)

# Typecheck the entire monorepo
pnpm typecheck

# Lint all packages
pnpm lint

# Execute Vitest & Next.js Builds
pnpm test
pnpm build

# Stage and Commit
git add .
git commit -m "feat: new component"
```

## Manual Intervention Check

- **Requires `--no-verify`?** No.
- **Requires disabling Husky?** No.
- **Requires manual `eslint` commands?** No.
- **Requires untracking build artifacts?** No.

The developer experience is seamless, native, and enforced automatically by the workspace.
