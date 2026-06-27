# Only3d Custom - Development Workflow Rules

1. Never use regex-based PowerShell or Node one-liners to modify source files unless absolutely unavoidable.
2. Edit source files directly whenever possible.
3. If a command fails more than twice, stop retrying blindly. Instead:
   - inspect the compiler output,
   - identify the root cause,
   - fix it,
   - rerun.
4. Temporary generation scripts may be created during execution but must be deleted before the task is considered complete unless they are intended as permanent developer tooling.
5. Never report success until all of the following have completed successfully:
   - lint
   - build
   - typecheck
   - tests
   - commit
   - push
   - GitHub Actions
6. Do not describe a feature as complete while CI is still pending.
7. Minimize shell command count. Prefer making one correct edit over many small automated patches.
8. Avoid repeated search-and-replace operations on production code. Prefer AST-aware edits or direct source edits.
9. Every architectural change must leave the repository in a clean state (git status must report "working tree clean").
10. Don't use curl to poll GitHub. Don't require gh (GitHub CLI). After a successful git push, stop and tell the user: "Please confirm the GitHub Actions run is green"
