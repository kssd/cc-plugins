---
description: Cross-artifact gap and contradiction analysis (spec ↔ plan ↔ tasks ↔ constitution).
argument-hint: "[feature-slug or NNN, optional]"
allowed-tools: Read Bash Grep Glob
---

# /sdd:analyze

Target: `$ARGUMENTS` (defaults to most recent feature).

## Steps

1. Resolve target.
2. Dispatch the **spec-auditor** subagent (read-only) with all four paths: `spec.md`, `plan.md`, `tasks.md`, `.specify/memory/constitution.md`.
3. The auditor must report on:
   - **Coverage gaps:** REQ-IDs in spec missing from plan or tasks.
   - **Orphans:** tasks or plan rows referencing REQ-IDs not in spec.
   - **Contradictions:** acceptance criteria that conflict with plan choices.
   - **Constitution drift:** plan rows for principles whose wording has changed since the plan was written.
   - **Implementation leak:** tech detail in `spec.md`.
   - **Untestable acceptance:** clauses lacking observable triggers/responses (re-runs **sdd-ears-authoring** audit).
4. Produce a markdown report with severity per finding (`FAIL` / `WARN` / `INFO`) and a remediation suggestion.
5. Offer to run `/sdd:amend` if findings warrant scope or spec changes.
