# Task DAG: [FEATURE NAME]

**Feature ID:** FEAT-[NNN]
**Plan:** `./plan.md`

> This is a **dependency graph**, not a todo list. Every task names the REQ-IDs it satisfies and the tasks it depends on. Tasks with no remaining unresolved dependencies in the same wave are marked `[P]` (parallelizable).

## Wave 1 — Foundations

- **T001** — [title]
  - **Satisfies:** FEAT-[NNN]-R01
  - **Depends on:** —
  - **Outputs:** [files / artifacts]
  - **Acceptance:** AC-R01-1
  - **Notes:** [...]

## Wave 2 — Core

- **T010 [P]** — [title]
  - **Satisfies:** FEAT-[NNN]-R02
  - **Depends on:** T001
  - **Outputs:** [...]
  - **Acceptance:** AC-R02-1
- **T011 [P]** — [title]
  - **Satisfies:** FEAT-[NNN]-R03
  - **Depends on:** T001
  - **Outputs:** [...]
  - **Acceptance:** AC-R03-1

## Wave 3 — Integration & Tests

- **T020** — [title]
  - **Satisfies:** FEAT-[NNN]-R01, FEAT-[NNN]-R02
  - **Depends on:** T010, T011
  - **Outputs:** [...]
  - **Acceptance:** [list]

## Coverage check

Every requirement in `spec.md` MUST appear as `Satisfies:` on at least one task. The task-decomposer agent emits this section verifying coverage.

| REQ-ID | Tasks |
|---|---|
| FEAT-[NNN]-R01 | T001, T020 |
| FEAT-[NNN]-R02 | T010, T020 |
| FEAT-[NNN]-R03 | T011 |
