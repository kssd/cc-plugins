#!/usr/bin/env bash
# PostToolUse advisory: if a feature is active and the MCP build exists, run drift_detector in advisory mode.
# Non-blocking; output a single line or nothing.
set -u

# Only run if we have an active feature
if [ ! -d specs ]; then exit 0; fi
LATEST=$(ls -1dt specs/[0-9][0-9][0-9]-* 2>/dev/null | head -n1)
if [ -z "${LATEST:-}" ]; then exit 0; fi

MCP_BIN="${CLAUDE_PLUGIN_ROOT}/mcp/dist/index.js"
SNAP="${CLAUDE_PLUGIN_DATA:-.sdd-data}/drift-snapshot.json"
if [ ! -f "$MCP_BIN" ] || [ ! -f "$SNAP" ]; then exit 0; fi

# Speak JSON-RPC to the MCP server: list-tools + call drift_detector(mode=advisory).
# Keep it simple: run a one-shot node invocation that calls the local helper.
ADVISORY=$(node "${CLAUDE_PLUGIN_ROOT}/hooks/drift-advisory.mjs" 2>/dev/null || true)
if [ -n "$ADVISORY" ]; then
  echo "$ADVISORY"
fi
