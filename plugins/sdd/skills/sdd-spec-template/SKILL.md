---
name: sdd-spec-template
description: Templates for SDD artifacts (spec.md, plan.md, tasks.md, constitution.md, checklist.md, quickstart.md). Use this skill whenever scaffolding a new feature spec or any companion SDD artifact so file structure stays consistent across features.
---

# SDD artifact templates

When a command (e.g. `/sdd:specify`, `/sdd:plan`, `/sdd:tasks`, `/sdd:constitution`, `/sdd:checklist`) needs to create one of the standard SDD artifacts, copy the corresponding template from this skill's `templates/` directory verbatim, then fill the bracketed placeholders. Never freelance the structure — downstream tools (traceability graph, drift detector, analyze, sync) depend on these sections existing.

## Files

- `templates/spec.md` — feature specification with EARS acceptance criteria and `[NEEDS CLARIFICATION]` markers.
- `templates/plan.md` — technical plan (no implementation code).
- `templates/tasks.md` — task DAG with REQ-ID backlinks and parallel-wave annotations `[P]`.
- `templates/constitution.md` — versioned project principles.
- `templates/checklist.md` — acceptance & review readiness.
- `templates/quickstart.md` — manual smoke test for the feature.

## Rules

1. **Strip implementation detail from `spec.md`.** Tech choices live in `plan.md`, never in spec.
2. **Every acceptance clause uses EARS** (see `sdd-ears-authoring`).
3. **Every requirement gets a REQ-ID** `FEAT-NNN-RNN` (see `sdd-traceability`).
4. **Mark unknowns explicitly** with `[NEEDS CLARIFICATION: <question>]`. Never invent answers.
5. **Folder naming** for specs: `specs/NNN-<kebab-slug>/` where `NNN` is the next zero-padded integer based on existing folders.
6. **Constitution lives at** `.specify/memory/constitution.md` and is shared across all features.

## How to apply

1. Determine the target file path (per command's contract).
2. Read the matching template from `${CLAUDE_PLUGIN_ROOT}/skills/sdd-spec-template/templates/<name>.md`.
3. Write it to the target path, substituting placeholders. Preserve all section headings exactly.
4. Hand off to the next agent without further edits to template structure.
