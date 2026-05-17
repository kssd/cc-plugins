---
description: Regenerate-don't-patch — update spec, re-plan affected tasks, re-implement.
argument-hint: "[feature-slug or NNN] <amendment note>"
allowed-tools: Read Write Edit Bash Grep Glob AskUserQuestion
---

# /sdd:amend

Arguments: `$ARGUMENTS`

The sanctioned path for scope changes. Code edits without an amendment trigger drift advisories.

## Steps

1. Resolve target feature directory (first whitespace-delimited token if it matches a slug, else most recent feature).
2. Dispatch the **spec-author** subagent to apply the amendment to `spec.md`:
   - Add new REQ-IDs (don't renumber existing).
   - Deprecate removed requirements with `*DEPRECATED <date>: <reason>*` (don't delete).
   - Update / add EARS acceptance clauses.
3. Append to `clarifications.md` a dated amendment entry.
4. Run `/sdd:analyze` automatically and surface findings.
5. Determine impacted tasks:
   - Tasks satisfying a deprecated REQ → move under `## Removed` in `tasks.md`.
   - Tasks satisfying a changed REQ → mark `**Status:** stale` and queue for redo.
   - New REQs → dispatch **task-decomposer** to add new tasks (preserve existing task numbering).
6. Re-run `sdd-constitution-gate` against `plan.md`. If `FAIL`, prompt the user to update `plan.md` before `/sdd:implement` may run.
7. Summarize: REQs added / changed / deprecated, tasks added / stale / removed, and recommend the next `/sdd:implement` invocation.
