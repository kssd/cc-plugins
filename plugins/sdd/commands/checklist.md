---
description: Produce or update the readiness checklist for a feature.
argument-hint: "[feature-slug or NNN, optional]"
allowed-tools: Read Write Edit Bash Grep Glob
---

# /sdd:checklist

Target: `$ARGUMENTS` (defaults to most recent feature).

## Steps

1. Resolve target directory.
2. Copy `${CLAUDE_PLUGIN_ROOT}/skills/sdd-spec-template/templates/checklist.md` to `<dir>/checklist.md` if missing.
3. Dispatch the **spec-auditor** subagent to evaluate every checkbox automatically where possible:
   - Spec readiness — grep for markers, REQ-IDs, EARS forms.
   - Plan readiness — verify compliance section, alternatives, contracts validate.
   - Tasks readiness — verify coverage table and dependencies.
   - Implementation readiness — call MCP `traceability_graph` and check tests exist per REQ.
   - Sync readiness — run MCP `drift_detector` in advisory mode.
4. Tick items in `checklist.md` that pass automatically. For items that need human judgement, leave unchecked and add a `<!-- review: ... -->` hint.
5. Print summary counts: `<passed> / <total>` and the top three blockers.
