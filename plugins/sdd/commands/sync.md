---
description: Detect drift between code and spec; propose amendments.
argument-hint: "[feature-slug or NNN, optional]"
allowed-tools: Read Bash Grep Glob
---

# /sdd:sync

Target: `$ARGUMENTS` (defaults to most recent feature).

## Steps

1. Resolve target feature directory.
2. Invoke MCP `sdd.drift_detector` with `snapshot: "latest"` and scope = feature directory's annotated source files.
3. Apply the **sdd-drift-detect** skill to interpret the report. Build a table:

   | File | Symbol | Kind | REQ-IDs | Recommendation |
   |---|---|---|---|---|

   …where Recommendation is one of `AMEND_SPEC`, `AMEND_CODE`, `NO_OP`.
4. Summarize counts at the top and present to the user.
5. Offer next actions:
   - `AMEND_SPEC` rows → run `/sdd:amend`.
   - `AMEND_CODE` rows → file as `tasks.md` bug task and run `/sdd:implement`.
   - `NO_OP` rows → add to allowlist (write to `<dir>/.sdd-drift-allowlist`).
6. If no drift, report "in sync" and exit.
