---
description: Execute one or more tasks from tasks.md with REQ-ID-traced code.
argument-hint: "[task-id or 'wave N' or 'next'] [feature-slug optional]"
allowed-tools: Read Write Edit Bash Grep Glob
---

# /sdd:implement

Arguments: `$ARGUMENTS`

Execute task(s) from `tasks.md`. Defaults: target = most recent feature; selection = `next` (first task whose dependencies are all complete and which is not yet done).

## Preconditions

- `<dir>/tasks.md` exists with valid coverage table.
- All dependencies of selected task(s) are complete (tracked via `- [x]` checkbox or explicit `**Status:** done`).

## Steps

1. Resolve target feature and task selection (single `T###`, `wave N`, or `next`).
2. For each selected task, dispatch the **implementer** subagent with:
   - the task's full entry from `tasks.md`,
   - the spec and plan paths,
   - the constitution path.
3. The subagent must:
   - Read all dependent task outputs first.
   - Make the minimum edits to satisfy `Outputs` and `Acceptance`.
   - Annotate code with `REQ:FEAT-NNN-RNN` comments on the implementing function(s)/file — see **sdd-traceability**.
   - Add or update tests covering the task's acceptance criteria.
4. After each task completes:
   - Mark the task complete in `tasks.md` (`**Status:** done` line + timestamp).
   - Invoke MCP `sdd.traceability_graph.build({ root: "<dir>" })` to refresh the index.
   - Invoke MCP `sdd.drift_detector.snapshot({ root: "<dir>" })` to record a fresh AST baseline for future drift detection.
5. If acceptance tests fail, do **not** mark complete. Surface failure and stop.

## Refuse if

- The task has no `REQ:` link (block per **sdd-traceability**).
- The chosen task's dependencies aren't complete.
