---
name: sdd-traceability
description: REQ-ID conventions and bidirectional traceability between spec, tasks, code, and tests. Use whenever writing or auditing requirements, tasks, code comments, or tests to ensure every implementation artifact back-links to a requirement.
---

# Traceability rules

## REQ-ID format

`FEAT-<NNN>-R<NN>` — e.g. `FEAT-001-R03`. Stable for the life of the requirement. Never renumber to "tidy up" — append new IDs and mark obsolete requirements `*DEPRECATED*`.

## Propagation

Every REQ-ID must appear in at least these places:

1. **`spec.md`** — under §4 Functional Requirements.
2. **`spec.md`** — as `*(satisfies FEAT-NNN-RNN)*` on at least one acceptance clause.
3. **`tasks.md`** — under `Satisfies:` on at least one task, and in the coverage table.
4. **Code** — as `REQ:FEAT-NNN-RNN` in a comment near the implementing function/module (one comment is enough — top of file or just above the function).
5. **Tests** — in the test name or a `// REQ:` comment.

Example code annotation:

```ts
// REQ:FEAT-001-R03 — slug uniqueness within 7-char namespace
export function generateSlug(): string { ... }
```

## Querying the graph

The `sdd` MCP server exposes:

- `traceability_graph.build({ root })` — rebuilds the index by scanning `specs/`, `tasks.md`, and source files for `REQ:` annotations.
- `traceability_graph.query({ id?, file?, kind? })` — returns adjacency for a REQ-ID, file, or category (`spec`, `task`, `code`, `test`).

Always rebuild before reporting if a file has been edited since the last build.

## Audit failure modes

- **Orphan REQ-ID in spec** — declared but no task satisfies it → block `/sdd:tasks` completion.
- **Orphan task** — task declares a REQ-ID not in spec → block.
- **Unreferenced code annotation** — code mentions a REQ-ID not in spec → flag as drift.
- **Untested REQ** — REQ has no test annotation → `WARN` (some non-functional REQs may be exempt; require an explicit `NOTEST:` waiver in spec).

## Deprecation

When a requirement is no longer in scope:

1. Mark it `*DEPRECATED <YYYY-MM-DD>: <reason>*` in spec — do not delete.
2. Run `/sdd:sync` to surface code still referencing the deprecated ID.
3. Move corresponding tasks to a `## Removed` section in `tasks.md`.
