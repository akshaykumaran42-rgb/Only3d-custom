# ROOT CAUSE ANALYSIS: Engineering Foundation Git Hooks

This document outlines the root causes for the `git commit` failures observed by new developers when attempting to commit to the Monorepo.

## 1. Missing `lint-staged` Script in `package.json`

**Symptom**: `ERR_PNPM_NO_SCRIPT Missing script: lint-staged`
**Root Cause**: The `.husky/pre-commit` file was configured to execute `pnpm run lint-staged`. However, no matching `"lint-staged"` script was defined within the `scripts` block of the root `package.json`.

## 2. Invalid CLI Runner in Husky Hooks

**Symptom**: `Command "lint-staged" not found` or `npx` escaping errors on Windows.
**Root Cause**:

- `.husky/pre-commit` attempted to use `pnpm run lint-staged` instead of the correct binary execution syntax `pnpm exec lint-staged` (or `pnpm dlx`).
- `.husky/commit-msg` attempted to use `npx --no -- commitlint` which bypassed the `pnpm` workspace lockfile and incorrectly evaluated the commit message path parameter (`"$1"`), causing the string to be corrupted by the Windows CMD subsystem (`ENOENT: no such file or directory, open 'F:\Only3d custom\ '`).

## 3. ESLint Workspace Boundary Violation

**Symptom**: `ESLint couldn't find a configuration file...` when `lint-staged` analyzed staged files.
**Root Cause**: `lint-staged` ran `eslint --fix` on staged files located inside workspace packages (like `packages/database/src/index.ts`). Because neither `packages/database` nor the repository root contained an `.eslintrc.js` file, ESLint traversed all the way to the user's home directory and crashed.

## 4. Linting Uncategorized File Types

**Symptom**: `Parsing error: Unexpected token as` during `eslint --fix`.
**Root Cause**: When a root `.eslintrc.js` was introduced to fix the boundary violation, it lacked the TypeScript parsing directives needed to comprehend files inside the `@only3d/*` workspace packages, causing ESLint to treat TypeScript as plain JavaScript.

## 5. Non-Conventional Commit Rejection

**Symptom**: `git commit -m "Engineering foundation validation"` failed.
**Root Cause**: `commitlint` is strictly enforced to block any commit message that does not follow the `type: subject` standard (e.g., `feat: xxx`). The requested test message intentionally violated these standards, resulting in a correct failure, but blocking the requested foundation test.
