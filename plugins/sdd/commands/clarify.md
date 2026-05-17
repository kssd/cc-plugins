---
description: Resolve [NEEDS CLARIFICATION] markers in the current feature spec via interactive Q&A.
argument-hint: "[feature-slug or NNN, optional — defaults to most recent]"
allowed-tools: Read Write Edit Bash Grep Glob AskUserQuestion
---

# /sdd:clarify

Target: `$ARGUMENTS` (optional — defaults to most recently modified `specs/NNN-*/spec.md`).

## Steps

1. Resolve the target feature directory:
   - If `$ARGUMENTS` provided, find `specs/*$ARGUMENTS*/spec.md`.
   - Otherwise pick the most recently modified `specs/*/spec.md`.
2. Grep for `[NEEDS CLARIFICATION:` markers. If zero, report "no open clarifications" and stop.
3. For each marker (in document order), ask the user via **AskUserQuestion**. Offer 2–4 plausible answers plus "Other" derived from the spec context.
4. As each answer is received:
   - Update the relevant requirement / acceptance clause in `spec.md` (remove the marker).
   - Append to `specs/<dir>/clarifications.md` an entry: timestamp, question, chosen answer, rationale.
   - If the answer reveals new requirements, assign new REQ-IDs (continuing the existing numbering).
5. After all markers are resolved, re-run the EARS audit (per **sdd-ears-authoring**) and report any new issues.
6. Final summary: count of resolved markers, new REQ-IDs added, and a prompt to run `/sdd:plan`.

## Notes

- Never silently invent answers. If the user picks "Other" with vague text, follow up with more questions.
- Keep `clarifications.md` chronological — it is the audit trail.
