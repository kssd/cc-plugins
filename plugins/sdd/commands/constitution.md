---
description: Create or amend the project constitution (.specify/memory/constitution.md).
argument-hint: "[principle keywords or amendment note]"
allowed-tools: Read Write Edit Bash Grep Glob
---

# /sdd:constitution

Arguments: `$ARGUMENTS`

Manage the project's non-negotiable principles. The constitution lives at `.specify/memory/constitution.md` and gates every plan via the **sdd-constitution-gate** skill.

## Steps

1. Check whether `.specify/memory/constitution.md` exists.
   - If **not**, copy the template from `${CLAUDE_PLUGIN_ROOT}/skills/sdd-spec-template/templates/constitution.md` to `.specify/memory/constitution.md`. Then dispatch the **spec-author** subagent to interview the user and fill principles informed by `$ARGUMENTS` (use these as initial seeds, not final wording).
   - If **yes**, treat `$ARGUMENTS` as an amendment note and propose edits. Bump the version (PATCH = wording, MINOR = new principle, MAJOR = removal/inversion) and update the change log section.
2. Dispatch the **constitution-guardian** subagent (read-only) to critique the result for falsifiability, conciseness, and conflict with existing principles.
3. Apply any revisions, show the diff, and confirm with the user before writing.
4. If a feature is currently in progress (any `specs/NNN-*/` directory exists), advise the user to run `/sdd:analyze` to recheck active plans against the amended constitution.

## Failure modes

- If the user provides only platitudes (e.g. "be good"), refuse and ask for falsifiable language.
- Never write principles that contradict an existing principle without an explicit MAJOR version bump and rationale.
