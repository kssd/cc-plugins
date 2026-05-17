---
description: Decompose plan.md into a tasks.md DAG with REQ-ID coverage and parallel-wave annotations.
argument-hint: "[feature-slug or NNN, optional]"
allowed-tools: Read Write Edit Bash Grep Glob
---

# /sdd:tasks

Target: `$ARGUMENTS` (defaults to most recent feature).

## Preconditions

- `<dir>/plan.md` exists and passed the constitution gate (re-run gate to be sure).

## Steps

1. Resolve target feature directory.
2. Copy `${CLAUDE_PLUGIN_ROOT}/skills/sdd-spec-template/templates/tasks.md` to `<dir>/tasks.md` if missing.
3. Dispatch the **task-decomposer** subagent with paths to `spec.md`, `plan.md`, and `tasks.md`. The agent must follow **sdd-task-dag**.
4. After the agent returns, verify the **coverage table** at the bottom of `tasks.md`:
   - Every REQ-ID from `spec.md` appears in at least one task.
   - No task declares a REQ-ID not in `spec.md`.
   - No cyclic dependencies (run a topological sort sanity check).
5. If any verification fails, return to step 3 with explicit feedback. Do not accept a flat todo list.
6. Summarize for the user: count of tasks, depth (number of waves), `[P]` count, and recommend `/sdd:implement T001`.
