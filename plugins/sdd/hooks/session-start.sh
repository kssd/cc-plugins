#!/usr/bin/env bash
# SessionStart hook: surface the active constitution + most recent feature so the model has SDD context immediately.
set -u

CONST=".specify/memory/constitution.md"
if [ -f "$CONST" ]; then
  VERSION=$(grep -m1 '^\*\*Version:\*\*' "$CONST" | sed 's/^\*\*Version:\*\*\s*//')
  echo "# sdd plugin"
  echo "Constitution active: v${VERSION:-unknown} (.specify/memory/constitution.md)"
  # Print principle headings only — keeps context small
  grep -E '^### P[0-9]+ — ' "$CONST" | sed 's/^### /  /'
else
  echo "# sdd plugin"
  echo "No constitution found. Run /sdd:constitution to bootstrap."
fi

if [ -d specs ]; then
  LATEST=$(ls -1dt specs/[0-9][0-9][0-9]-* 2>/dev/null | head -n1)
  if [ -n "${LATEST:-}" ]; then
    echo "Most recent feature: $LATEST"
    OPEN=$(grep -c '\[NEEDS CLARIFICATION:' "$LATEST/spec.md" 2>/dev/null || echo 0)
    echo "  open clarifications: $OPEN"
  fi
fi
