---
description: Produce technical plan, research, data model, and contracts for the current feature (constitution-gated).
argument-hint: "[feature-slug or NNN, optional]"
allowed-tools: Read Write Edit Bash Grep Glob WebSearch WebFetch
---

# /sdd:plan

Target: `$ARGUMENTS` (defaults to most recent feature).

## Preconditions (refuse if not met)

- `.specify/memory/constitution.md` exists.
- Target `spec.md` exists.
- Target `spec.md` contains **zero** `[NEEDS CLARIFICATION]` markers. Otherwise direct user to `/sdd:clarify`.

## Steps

1. Resolve target feature directory.
2. Copy `${CLAUDE_PLUGIN_ROOT}/skills/sdd-spec-template/templates/plan.md` to `<dir>/plan.md` if missing.
3. Dispatch the **plan-architect** subagent with:
   - paths to `spec.md`, the constitution, and the empty `plan.md`,
   - permission to create `<dir>/research.md`, `<dir>/data-model.md`, `<dir>/contracts/*`.
4. The subagent must:
   - Fill the requirement→component map for **every** REQ-ID.
   - Produce concrete contracts (OpenAPI / JSON Schema / Protobuf) under `<dir>/contracts/` when the feature exposes an interface.
   - Document at least one rejected alternative.
   - Complete the Constitution Compliance section for every principle.
5. Dispatch the **constitution-guardian** to run the **sdd-constitution-gate** skill against the result. On `FAIL`, surface the failure and stop — do not proceed to tasks.
6. On `PASS`, summarize for the user (components touched, contracts produced, principles covered) and recommend `/sdd:tasks`.
