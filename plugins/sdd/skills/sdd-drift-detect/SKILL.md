---
name: sdd-drift-detect
description: Detect and interpret drift between code and spec via the MCP `drift_detector` tool. Use during `/sdd:sync` and on PostToolUse advisories to decide between amending the spec, amending the code, or reverting.
---

# Drift detection

Drift = the implementation no longer matches the spec. The `sdd` MCP server's `drift_detector` tool compares the current AST surface (exported functions, types, signatures) of files that carry `REQ:` annotations to a snapshot recorded on the last successful `/sdd:implement`.

## Invocation

```text
mcp call sdd.drift_detector { snapshot: "latest", scope: "<feature-dir or file glob>" }
```

Returns:

```json
{
  "added":   [{ "file": "...", "symbol": "...", "reqIds": [] }],
  "removed": [{ "file": "...", "symbol": "...", "reqIds": ["FEAT-001-R03"] }],
  "renamed": [{ "from": "...", "to": "...", "reqIds": [...] }],
  "signatureChanged": [{ "file": "...", "symbol": "...", "before": "...", "after": "..." }]
}
```

## Interpretation

For each entry decide one of:

- **AMEND_SPEC** — the code change is intentional and the spec is stale. → Produce an amendment proposal: which REQ-ID to add / change / deprecate. Hand to `/sdd:amend`.
- **AMEND_CODE** — the spec is right, the code drifted (refactor lost a REQ link, function deleted by accident). → Restore or add `REQ:` annotation; if behavior was lost, file as a bug task.
- **NO_OP** — internal refactor that doesn't change observable behavior (rename of a private helper). Add the symbol to an allowlist comment to suppress next run.

## Decision rubric

- Symbol carries REQ-IDs and is now removed → almost always `AMEND_SPEC` or `AMEND_CODE` (never silent).
- New exported symbol without a REQ link → `AMEND_SPEC` if it adds behavior; otherwise add REQ annotation.
- Signature change on a symbol with REQ-IDs → check acceptance criteria; signature shape is observable for public APIs.

## Output

The skill produces a markdown table in the user's working session:

```text
| File | Symbol | Kind | REQ-IDs | Recommendation |
|---|---|---|---|---|
```

…and offers to run `/sdd:amend` to materialize the AMEND_SPEC actions.

## PostToolUse advisory mode

When invoked from the `PostToolUse` hook, run with `mode: "advisory"` — output is a single line per drift entry, suppressed if empty. Never block the user's edit; surface a one-line summary like:

```text
sdd drift advisory: 1 removal — symbol `generateSlug` carried FEAT-001-R03 (run /sdd:sync)
```
