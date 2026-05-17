# sdd — Spec-Driven Development for Claude Code

Pragmatic Spec-Driven Development workflow. The **spec is the source of truth**: code is derived from specs, tasks back-link to requirement IDs, and drift between code and spec is detected and surfaced.

## Lifecycle

```
constitution → specify → clarify → plan → tasks → implement → sync ↻
                                                        ↘ trace / analyze
```

## Commands

| Command                     | What it does                                                                                  |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| `/sdd:constitution`         | Create or amend `.specify/memory/constitution.md` (versioned principles).                     |
| `/sdd:specify <brief>`      | Scaffold `specs/NNN-<slug>/spec.md` with EARS acceptance and `[NEEDS CLARIFICATION]` markers. |
| `/sdd:clarify`              | Resolve clarification markers via Q&A; appends to `clarifications.md`.                        |
| `/sdd:plan`                 | Produce `plan.md`, `research.md`, `data-model.md`, `contracts/` (constitution-gated).         |
| `/sdd:tasks`                | Decompose plan into `tasks.md` (DAG with REQ-ID backlinks).                                   |
| `/sdd:implement [task-id]`  | Execute task(s); enforce REQ-ID code comments.                                                |
| `/sdd:analyze`              | Gap/contradiction analysis across spec/plan/tasks.                                            |
| `/sdd:sync`                 | Detect drift between code and spec; propose amendments.                                       |
| `/sdd:trace <REQ-ID\|file>` | Show traceability slice via MCP.                                                              |
| `/sdd:checklist`            | Acceptance-readiness checklist.                                                               |
| `/sdd:amend`                | Regenerate-don't-patch: update spec → re-plan → re-implement.                                 |

## Layout produced in your repo

```
.specify/memory/constitution.md
specs/001-<slug>/
  spec.md
  clarifications.md
  plan.md
  research.md
  data-model.md
  contracts/
  tasks.md
  quickstart.md
  checklist.md
```

## One-time setup

The MCP server is TypeScript. After installing the plugin:

```sh
cd "$(claude plugin path sdd)/mcp"   # or wherever the plugin is cached
npm install
npm run build
```

## Acknowledgements

Conventions adapted from [GitHub Spec Kit](https://github.com/github/spec-kit) and Amazon Kiro's spec workflow.
