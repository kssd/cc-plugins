---
name: sdd-ears-authoring
description: Author and review acceptance criteria in EARS (Easy Approach to Requirements Syntax). Use whenever writing, refining, or auditing `spec.md` acceptance criteria so every clause is unambiguous, testable, and back-linked to a requirement.
---

# Authoring EARS acceptance criteria

EARS keeps acceptance criteria short, unambiguous, and testable. Every criterion in `spec.md` must use one of the five EARS patterns below and reference the REQ-ID it satisfies.

## The five patterns

1. **Ubiquitous** — `THE SYSTEM SHALL <response>.`
   *Use only for invariants always true.*
2. **Event-driven** — `WHEN <trigger> THE SYSTEM SHALL <response>.`
3. **State-driven** — `WHILE <state> THE SYSTEM SHALL <response>.`
4. **Optional feature** — `WHERE <feature is included> THE SYSTEM SHALL <response>.`
5. **Unwanted behavior** — `IF <unwanted precondition> THEN THE SYSTEM SHALL <response>.`

Combine with `AND`/`OR` only inside the trigger or precondition, never inside the response.

## Quality rules

- One observable response per clause. If you need two responses, write two clauses.
- The **response** must be observable from outside the system (no internal-state language like "the cache SHALL be warm").
- Avoid weasel words: *user-friendly*, *efficient*, *reasonable*, *fast*, *secure*. Replace with a measurable property.
- Each clause has an **ID** `AC-<REQ-suffix>-<n>` (e.g. `AC-R01-1`) and a trailing `*(satisfies FEAT-NNN-RNN)*`.
- No implementation detail (DB, framework, language) — that belongs in `plan.md`.

## Worked examples

- ✅ `WHEN a user submits a shorten request with a valid URL THE SYSTEM SHALL return a 7-character slug within 200 ms (p95). *(satisfies FEAT-001-R01)*`
- ✅ `IF the rate limit for the caller is exceeded THEN THE SYSTEM SHALL reject the request with HTTP 429. *(satisfies FEAT-001-R04)*`
- ❌ `The shortener should be fast and reliable.` *(weasel words, no trigger, no REQ-ID)*
- ❌ `WHEN a user submits a URL THE SYSTEM SHALL insert a row into the `links` table.` *(implementation detail)*

## Audit checklist

When reviewing an existing `spec.md`:

1. Every criterion matches one of the five patterns exactly.
2. Every criterion has an `AC-…` ID and a `satisfies` back-link.
3. Every REQ-ID has at least one criterion.
4. No criterion uses weasel words or implementation detail.
5. Where a clarification is required to make a criterion testable, replace it with `[NEEDS CLARIFICATION: <question>]` rather than guessing.
