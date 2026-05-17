---
name: scaffold-ci
description: GitHub Actions CI templates per stack (Node/TS, Python, Go, generic, docs). Use when the user opts in to CI during `/scaffold:init` so the right workflow is dropped into `.github/workflows/ci.yml`.
---

# Scaffold CI

Each stack has a `ci.yml` template under `${CLAUDE_PLUGIN_ROOT}/skills/scaffold-templates/templates/{stack}/ci.yml`. They share a common shape:

- Triggered on `push` to default branch and on `pull_request`.
- One `lint` job + one `test` job (or a single `check` job for trivial stacks).
- `actions/checkout@v4` and the stack's official setup action, both pinned to a major version.
- `permissions: contents: read` at the workflow level.

## Per-stack contents

- **Node/TypeScript** — `actions/setup-node@v4` with `cache: '{{PACKAGE_MANAGER}}'`, runs `{{PACKAGE_MANAGER}} ci` (or `install --frozen-lockfile` for pnpm/yarn), `{{PACKAGE_MANAGER}} run lint`, `{{PACKAGE_MANAGER}} test --if-present`.
- **Python** — `actions/setup-python@v5` + install `uv`, `uv sync`, `uv run ruff check .`, `uv run pytest -q` (skipped if no `tests/`).
- **Go** — `actions/setup-go@v5`, `go mod download`, `golangci-lint-action`, `go test ./...`.
- **Generic** — minimal skeleton job that runs `echo "CI placeholder — add steps for your project"`; useful to keep the workflow file in place.
- **Docs** — `DavidAnson/markdownlint-cli2-action` and `lycheeverse/lychee-action` for link checking; runs on PR only.

## When to skip

If the user answered **CI = No**, do not write `.github/workflows/ci.yml`. Do not create the `.github/` directory at all.

## Caveats to surface

- The Node workflow assumes `lint` and `test` scripts exist in `package.json`. The `tsconfig.json` template includes `"scripts": {}` placeholder guidance in the README, but the user must add scripts.
- The Python workflow assumes `uv` is the dependency manager. If the user prefers `pip` or `poetry`, they will need to edit `ci.yml`.
- `lychee` link-check can be noisy on first runs; the template includes a `.lycheeignore` reference but no preset ignores.
