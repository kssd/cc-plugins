---
name: sdd-constitution-gate
description: Enforce constitution compliance before a plan is accepted. Use during `/sdd:plan` or any plan review to verify each principle is addressed (complied with or justified deviation) before downstream task decomposition.
---

# Constitution compliance gate

`.specify/memory/constitution.md` defines non-negotiable principles. Plans that ignore them fail the gate.

## When this skill fires

- Right after `plan.md` is drafted in `/sdd:plan`.
- During `/sdd:analyze` to recheck active features after a constitution amendment.
- During PR review of any plan changes.

## Procedure

1. Read `.specify/memory/constitution.md`. If it does not exist, instruct the user to run `/sdd:constitution` and stop.
2. For each principle (P1, P2, …) read the corresponding row in `plan.md` § "Constitution Compliance".
3. Apply the **gate rules** below.
4. Emit a report — `PASS`, `FAIL: <principle> — <reason>`, or `WARN: <principle> — <reason>`. A single `FAIL` blocks downstream commands.

## Gate rules

- **Every principle MUST have a row.** Missing rows = `FAIL`.
- **A row that just restates the principle without addressing this feature = `FAIL`.** Compliance must be concrete.
- **Deviations need explicit sign-off:** the row must say `DEVIATION: <reason> — approved by <name> on <date>`. Otherwise `FAIL`.
- **Constitution version bump pending?** If the constitution changed since `plan.md` was last touched, `WARN` and recommend `/sdd:analyze`.

## Output format

```text
Constitution gate: <PASS|FAIL>
  P1 <name>: <PASS|FAIL|WARN> — <one-line reason>
  P2 <name>: ...
```

A `FAIL` result must be surfaced to the user verbatim and downstream commands (`/sdd:tasks`, `/sdd:implement`) must refuse to proceed.
