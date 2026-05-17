# Readiness Checklist: [FEATURE NAME]

**Feature ID:** FEAT-[NNN]

## Spec readiness
- [ ] All requirements have stable REQ-IDs.
- [ ] Every requirement has at least one EARS acceptance criterion.
- [ ] No `[NEEDS CLARIFICATION]` markers remain.
- [ ] Spec contains no implementation detail (frameworks, libraries, schema DDL).
- [ ] Non-functional requirements stated (performance, security, observability).

## Plan readiness
- [ ] Constitution compliance section completed for every relevant principle.
- [ ] Every REQ-ID appears in the requirement→component map.
- [ ] Contracts (`contracts/`) validate against their schema linter.
- [ ] At least one rejected alternative documented.

## Tasks readiness
- [ ] `tasks.md` covers every REQ-ID (coverage table present).
- [ ] All tasks declare dependencies and acceptance criteria.
- [ ] Parallelizable tasks marked `[P]` and have no shared writes.

## Implementation readiness
- [ ] Each merged change includes `REQ:FEAT-NNN-RNN` markers in code comments or commit body.
- [ ] Acceptance criteria mapped to automated tests.
- [ ] `quickstart.md` smoke script runs green.

## Sync readiness
- [ ] `/sdd:sync` reports no drift, or drift has an open amendment PR.
- [ ] Traceability graph builds without orphaned tasks or unmapped REQ-IDs.
