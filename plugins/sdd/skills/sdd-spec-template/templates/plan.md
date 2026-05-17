# Technical Plan: [FEATURE NAME]

**Feature ID:** FEAT-[NNN]
**Spec:** `./spec.md`
**Created:** [YYYY-MM-DD]

> This file maps **what** (spec) to **how**. Reference REQ-IDs (`FEAT-NNN-RNN`) throughout.

## 1. Approach Summary

[2–4 sentences: the chosen approach and the main tradeoff.]

## 2. Constitution Compliance

For each relevant principle in `.specify/memory/constitution.md`, state how this plan complies (or document a justified deviation with sign-off).

- **Principle:** [name] → **Compliance:** [...]
- ...

## 3. Architecture & Components

[Components, ownership boundaries, data flow. Diagram links welcome.]

## 4. Data Model

See `./data-model.md`.

## 5. Contracts

See `./contracts/` (OpenAPI / JSON Schema / Protobuf / etc.).

## 6. Requirement → Component Map

| REQ-ID | Component(s) | Notes |
|---|---|---|
| FEAT-[NNN]-R01 | [component] | [...] |

## 7. Cross-cutting concerns

- **Auth:** [...]
- **Observability:** [metrics/logs/traces by component]
- **Error handling strategy:** [...]
- **Migration / rollout:** [feature flags, backfills]

## 8. Alternatives considered

- [Alt A] — rejected because [...]
- [Alt B] — rejected because [...]

## 9. Research notes

See `./research.md`.

## 10. Risks & Mitigations

- [risk] → [mitigation]
