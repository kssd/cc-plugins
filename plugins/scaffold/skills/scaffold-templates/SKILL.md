---
name: scaffold-templates
description: Index of repo-scaffold templates plus the decision rubric for selecting and writing them. Use whenever scaffolding a new repository so the correct template set is chosen per stack and placeholders are substituted consistently.
---

# Scaffold templates

This skill is an index over `${CLAUDE_PLUGIN_ROOT}/skills/scaffold-templates/templates/`. The repo-initializer agent reads templates from here, substitutes placeholders, and writes to the target directory.

## Template directory layout

```
templates/
├── common/
│   ├── README.md
│   ├── LICENSE-MIT
│   ├── LICENSE-Apache-2.0
│   ├── LICENSE-BSD-3-Clause
│   ├── .editorconfig
│   └── .gitattributes
├── node/
│   ├── gitignore           → .gitignore
│   ├── dockerignore        → .dockerignore
│   ├── prettierrc.json     → .prettierrc.json
│   ├── eslint.config.mjs
│   ├── tsconfig.json
│   ├── devcontainer.json   → .devcontainer/devcontainer.json
│   └── ci.yml              → .github/workflows/ci.yml
├── python/
│   ├── gitignore           → .gitignore
│   ├── dockerignore        → .dockerignore
│   ├── pyproject.toml
│   ├── devcontainer.json   → .devcontainer/devcontainer.json
│   └── ci.yml              → .github/workflows/ci.yml
├── go/
│   ├── gitignore           → .gitignore
│   ├── dockerignore        → .dockerignore
│   ├── golangci.yml        → .golangci.yml
│   ├── devcontainer.json   → .devcontainer/devcontainer.json
│   └── ci.yml              → .github/workflows/ci.yml
├── generic/
│   ├── gitignore           → .gitignore
│   ├── dockerignore        → .dockerignore
│   ├── devcontainer.json   → .devcontainer/devcontainer.json
│   └── ci.yml              → .github/workflows/ci.yml
└── docs/
    ├── gitignore           → .gitignore
    ├── markdownlint.json   → .markdownlint.json
    └── ci.yml              → .github/workflows/ci.yml
```

Files stored without leading dots (e.g. `gitignore`) are renamed on write so they aren't hidden inside the template directory. The arrow column shows the destination path inside the target repo.

## Decision rubric

Always include `common/` files (README, .editorconfig, .gitattributes, chosen LICENSE).

| User answers | Template set written |
|---|---|
| Stack = Node/TypeScript | `common/*` + `node/{gitignore, dockerignore, prettierrc.json, eslint.config.mjs, tsconfig.json}` |
| Stack = Python | `common/*` + `python/{gitignore, dockerignore, pyproject.toml}` |
| Stack = Go | `common/*` + `go/{gitignore, dockerignore, golangci.yml}` |
| Stack = Generic/polyglot | `common/*` + `generic/{gitignore, dockerignore}` |
| Stack = Docs-only | `common/{README.md, LICENSE-*, .editorconfig, .gitattributes}` + `docs/{gitignore, markdownlint.json}` |
| + CI = Yes | additionally `{stack}/ci.yml` → `.github/workflows/ci.yml` |
| + Devcontainer = Yes | additionally `{stack}/devcontainer.json` → `.devcontainer/devcontainer.json` (skipped for `docs`) |
| License = None | skip the `common/LICENSE-*` file |

## Placeholders

Substitute these in every file before writing:

| Token | Source |
|---|---|
| `{{PROJECT_NAME}}` | User answer |
| `{{DESCRIPTION}}` | User answer |
| `{{YEAR}}` | `date +%Y` |
| `{{AUTHOR}}` | `git config user.name`, fallback `{{PROJECT_NAME}} authors` |
| `{{LICENSE}}` | SPDX ID (`MIT`, `Apache-2.0`, `BSD-3-Clause`) or `UNLICENSED` |
| `{{PACKAGE_MANAGER}}` | Node only: `npm`/`pnpm`/`yarn` |

## Output contract for the agent

After writing, emit:

1. Target directory (absolute path).
2. Bullet list of files written.
3. Bullet list of files skipped (pre-existing, no `--force`).
4. **Next steps** block.
5. **Caveats** block (Apache-2.0 → recommend `NOTICE`; Node + pnpm → suggest `corepack enable`; Python → suggest `uv sync` or `pip install -e .[dev]`).
