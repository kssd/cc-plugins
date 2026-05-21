#!/usr/bin/env bash
# Validates that marketplace.json and plugin.json name fields don't use
# reserved terms (claude, anthropic) that Claude Code rejects at install time.
set -euo pipefail

RESERVED_PATTERN='^(claude|anthropic)' # matches names that start with these
RESERVED_CONTAINS='claude|anthropic'   # matches names that contain these anywhere

errors=0

check_name() {
  local file="$1"
  local name="$2"
  if echo "$name" | grep -qiE "$RESERVED_CONTAINS"; then
    echo "ERROR: $file — name '$name' contains a reserved term (claude/anthropic)."
    echo "       Claude Code rejects manifests whose name impersonates an official marketplace."
    errors=$((errors + 1))
  fi
}

# Validate marketplace manifest
MARKETPLACE=".claude-plugin/marketplace.json"
if [[ -f "$MARKETPLACE" ]]; then
  name=$(jq -r '.name' "$MARKETPLACE")
  check_name "$MARKETPLACE" "$name"
else
  echo "WARNING: $MARKETPLACE not found, skipping."
fi

# Validate every plugin manifest
while IFS= read -r -d '' plugin_json; do
  name=$(jq -r '.name' "$plugin_json")
  check_name "$plugin_json" "$name"
done < <(find plugins -name "plugin.json" -path "*/.claude-plugin/*" -print0)

if [[ $errors -gt 0 ]]; then
  echo ""
  echo "Fix: rename the 'name' field(s) above to not include 'claude' or 'anthropic'."
  exit 1
fi

echo "All manifest names OK."
