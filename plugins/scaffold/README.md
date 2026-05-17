# scaffold

Initialize a new repository with best-practice defaults. Installs as a Claude Code plugin and exposes one slash command:

- `/scaffold:init` — interactively scaffolds a fresh repo (gitignore, license, README, editorconfig, devcontainer, linters/formatters, and GitHub Actions CI) for the chosen stack.

## Supported stacks (v0.1)

- **Node/TypeScript** — Prettier, ESLint (flat config), strict `tsconfig.json`, Node devcontainer.
- **Python** — `pyproject.toml` with Ruff + Black + pytest, `uv`-friendly devcontainer.
- **Go** — `golangci.yml`, Go devcontainer.
- **Generic/polyglot** — union `.gitignore`, `.dockerignore`, generic devcontainer.
- **Docs-only** — minimal `.gitignore`, `markdownlint.json`, link-check CI.

All stacks get the common files: `README.md`, `LICENSE`, `.editorconfig`, `.gitattributes`.

## What it does NOT do (v0.1)

- Does not run `git init` or create the first commit.
- Does not create a GitHub remote (no `gh` calls).
- Does not install dependencies.

Suggested next steps are printed at the end so you can run them yourself.

## How it works

`/scaffold:init` dispatches the **repo-initializer** agent, which uses `AskUserQuestion` to gather stack/license/CI/devcontainer/project-name answers, reads templates from `skills/scaffold-templates/templates/`, substitutes placeholders, and writes them to the current working directory.

The agent refuses to overwrite existing files without explicit confirmation. Pass `--dry-run` to preview the file list without writing anything.
