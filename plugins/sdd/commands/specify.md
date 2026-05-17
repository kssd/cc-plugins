---
description: Scaffold a new feature specification (specs/NNN-<slug>/spec.md) with EARS acceptance criteria.
argument-hint: "<feature brief>"
allowed-tools: Read Write Edit Bash Grep Glob
---

# /sdd:specify

Feature brief: `$ARGUMENTS`

Create a new feature specification in `specs/NNN-<slug>/`.

## Steps

1. Determine `NNN` — the next zero-padded integer after existing `specs/NNN-*` directories. Choose `001` if none exist.
2. Derive `<slug>` — a kebab-case short name (2–4 words) from the brief.
3. `mkdir -p specs/<NNN>-<slug>/contracts`.
4. Copy `${CLAUDE_PLUGIN_ROOT}/skills/sdd-spec-template/templates/spec.md` to `specs/<NNN>-<slug>/spec.md`.
5. Dispatch the **spec-author** subagent with:
   - the brief (`$ARGUMENTS`),
   - the path to the new spec file,
   - the contents of `.specify/memory/constitution.md` (so principles inform scope).
6. The subagent must follow **sdd-ears-authoring** for every acceptance clause and **sdd-traceability** for REQ-ID assignment. It MUST insert `[NEEDS CLARIFICATION: ...]` markers for any guess rather than inventing answers.
7. After the agent returns, surface a summary:
   - feature ID, slug, count of REQs, count of `[NEEDS CLARIFICATION]` markers,
   - recommend running `/sdd:clarify` if any markers remain.

## Refuse if

- `.specify/memory/constitution.md` does not exist → tell the user to run `/sdd:constitution` first.
- `$ARGUMENTS` is empty or under 5 words → ask for a fuller brief.
