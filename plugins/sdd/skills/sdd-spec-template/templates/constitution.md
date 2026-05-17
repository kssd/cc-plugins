# Project Constitution

**Version:** 1.0.0
**Last amended:** [YYYY-MM-DD]

> Non-negotiable principles for this project. Plans that conflict with the constitution are rejected unless the principle itself is amended (bump version).

## Principles

### P1 — [Name, e.g. "Simplicity over cleverness"]

[1–3 sentences. Concrete and falsifiable, not platitudes.]

**How this constrains plans:** [...]

### P2 — [Name]

[...]

### P3 — [Name]

[...]

## Amendment process

1. Open a PR titled `constitution: amend Pn`.
2. State the motivation and the inverse case (what the old principle was protecting against).
3. Bump version (MAJOR for principle removal/inversion, MINOR for new principle, PATCH for wording).
4. Re-run `/sdd:analyze` on active features to surface impacted plans.

## Change log

- **1.0.0** ([YYYY-MM-DD]) — Initial.
