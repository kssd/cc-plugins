---
description: Show traceability adjacency for a REQ-ID, file, or symbol.
argument-hint: "<REQ-ID | path | symbol>"
allowed-tools: Read Bash Grep Glob
---

# /sdd:trace

Query: `$ARGUMENTS`

## Steps

1. If `$ARGUMENTS` looks like `FEAT-NNN-RNN` → call MCP `sdd.traceability_graph.query({ id: "$ARGUMENTS" })`.
2. If it looks like a file path → call `query({ file: "$ARGUMENTS" })`.
3. Otherwise treat as a symbol name → call `query({ symbol: "$ARGUMENTS" })`.
4. Render the result as four columns: **Spec §** | **Tasks** | **Code (file:symbol)** | **Tests**.
5. If the index is stale (any source file mtime newer than the index timestamp), rebuild first via `traceability_graph.build`.
6. If nothing is found, suggest:
   - For REQ-ID with no tasks → run `/sdd:tasks`.
   - For code with no REQ-IDs → annotate per **sdd-traceability** or run `/sdd:sync`.
