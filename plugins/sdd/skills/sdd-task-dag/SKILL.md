---
name: sdd-task-dag
description: Decompose a plan into a dependency DAG of tasks (not a flat todo list). Use during `/sdd:tasks` and whenever amending tasks.md so dependencies, parallel waves, and REQ-ID coverage are explicit.
---

# Task decomposition as a DAG

`tasks.md` is a **directed acyclic graph**, not a checklist. Each task has dependencies, outputs, acceptance, and the REQ-IDs it satisfies. Tasks runnable in parallel are marked `[P]`.

## Required fields per task

```text
- **T<NNN>[ [P]]** — <imperative title>
  - **Satisfies:** FEAT-NNN-RNN[, ...]
  - **Depends on:** T<NNN>[, ...] | —
  - **Outputs:** <files / artifacts produced>
  - **Acceptance:** AC-…[, ...]
  - **Notes:** <optional>
```

## Decomposition rules

1. **One task = one bounded outcome.** If acceptance can't be stated in a single bullet, split.
2. **Granularity guideline:** 0.5–2 hours of focused work. Larger → split; smaller → merge.
3. **No task without a `Satisfies` line.** Pure-housekeeping tasks (e.g. CI config) get a non-functional REQ in spec or a justified `Satisfies: INFRA`.
4. **No fan-out without `[P]` analysis.** Two tasks at the same wave that both write the same file are *not* parallel.
5. **Tests are first-class tasks.** Either bundle test creation into the same task that implements behavior, or create a sibling task — never defer to a vague "testing wave at the end".
6. **Group into Waves** by maximum dependency depth. Wave 1 has no deps; Wave N depends only on Wave 1..N-1.

## Mandatory coverage table

End `tasks.md` with a table:

```text
| REQ-ID | Tasks |
|---|---|
| FEAT-NNN-R01 | T001, T010 |
```

Every REQ-ID in `spec.md` must appear with at least one task. If a REQ-ID has zero tasks → reject the decomposition and ask the spec-auditor to investigate (likely missing scope or a requirement that should be deprecated).

## Common anti-patterns to reject

- **Flat list** with no `Depends on:` fields → reject.
- **Tasks like "implement the backend"** → too coarse; split.
- **"Wire everything together" final task** with 10+ deps and no acceptance → split per integration point.
- **Missing acceptance** → tasks without observable acceptance can't be verified; reject.
