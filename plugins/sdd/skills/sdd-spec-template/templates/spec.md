# Feature Spec: [FEATURE NAME]

**Feature ID:** FEAT-[NNN]
**Status:** Draft
**Created:** [YYYY-MM-DD]
**Owners:** [names]

> The spec describes **what** and **why**. Implementation choices belong in `plan.md`. If a tech detail is leaking into this file, move it.

## 1. Problem & Goal

[1–3 paragraphs. What problem are we solving, for whom, and why now?]

## 2. Users & Scenarios

- **Primary user:** [role]
- **Key scenarios:**
  1. [user story in plain prose]
  2. ...

## 3. Scope

**In scope:**

- ...

**Out of scope (explicit non-goals):**

- ...

## 4. Functional Requirements

Each requirement has a stable REQ-ID. Code, tasks, and tests must back-reference these IDs.

- **FEAT-[NNN]-R01** — [requirement statement]
- **FEAT-[NNN]-R02** — [requirement statement]
- ...

## 5. Acceptance Criteria (EARS)

Use **WHEN / WHILE / IF / WHERE … THE SYSTEM SHALL …** form. Each criterion must be testable.

- **AC-R01-1** — WHEN [trigger] THE SYSTEM SHALL [observable behavior]. *(satisfies FEAT-[NNN]-R01)*
- **AC-R01-2** — IF [precondition] AND [trigger] THEN THE SYSTEM SHALL [observable behavior]. *(satisfies FEAT-[NNN]-R01)*
- **AC-R02-1** — WHILE [ongoing state] THE SYSTEM SHALL [behavior]. *(satisfies FEAT-[NNN]-R02)*

## 6. Non-Functional Requirements

- **Performance:** [budgets — latency, throughput]
- **Reliability:** [SLO / error budget]
- **Security & privacy:** [auth, PII handling]
- **Observability:** [metrics, logs, traces required]
- **Accessibility / i18n:** [if user-facing]

## 7. Data & Domain Concepts (tech-agnostic)

[Entities, relationships, lifecycle states. No table DDL — that lives in `data-model.md`.]

## 8. Open Questions

- [NEEDS CLARIFICATION: question 1]
- [NEEDS CLARIFICATION: question 2]

> `/sdd:plan` will refuse to run while `[NEEDS CLARIFICATION]` markers remain. Resolve via `/sdd:clarify`.

## 9. Risks & Assumptions

- **Assumption:** [...]
- **Risk:** [...] — **Mitigation:** [...]

## 10. References

- [link to design doc, ticket, prior art]
