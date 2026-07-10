---
name: Scripts package DB seeding
description: How to add one-off DB seed scripts under @workspace/scripts in this monorepo.
---

To write a data-seeding script (e.g. seeding lessons/content) under `scripts/src/`:

- Add both `@workspace/db` (workspace:*) AND `drizzle-orm` (catalog:) as direct `dependencies` in `scripts/package.json` — importing `drizzle-orm` helpers like `eq` inside the script fails at runtime with `ERR_MODULE_NOT_FOUND` if it's only a transitive dep of `@workspace/db`, since pnpm's workspace isolation doesn't hoist it automatically.

**Why:** tsx/ESM resolves imports strictly per-package `node_modules`, not via the dependency graph of an imported workspace package.

**How to apply:** whenever adding a new one-off script that touches the DB directly (not through an API route), declare its own `dependencies` explicitly rather than relying on `@workspace/db` re-exporting things transitively.
