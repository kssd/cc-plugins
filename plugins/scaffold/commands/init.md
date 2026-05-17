---
description: Initialize a repo with best-practice defaults (gitignore, linters, CI, devcontainer) for the chosen stack.
argument-hint: "[--dry-run]"
allowed-tools: Task Bash
---

# /scaffold:init

Initialize the **current working directory** as a new repo with best-practice defaults.

Arguments: `$ARGUMENTS` — pass `--dry-run` to preview the file list without writing.

## Steps

1. Resolve the target directory — the user's current working directory (`pwd`).
2. Dispatch the **repo-initializer** subagent with:
   - the target directory,
   - the `--dry-run` flag if present in `$ARGUMENTS`,
   - instructions to follow the **scaffold-templates** skill for template selection and the **scaffold-ci** skill for the GitHub Actions workflow.
3. The agent will:
   - Survey the target directory and flag any files that would be overwritten.
   - Ask the user (in a single batched `AskUserQuestion` call): **stack**, **license**, **package manager** (Node only), **CI on/off**, **devcontainer on/off**, **project name**, **one-line description**.
   - Write the resolved template set with placeholders substituted (`{{PROJECT_NAME}}`, `{{DESCRIPTION}}`, `{{YEAR}}`, `{{AUTHOR}}`, `{{LICENSE}}`).
   - Print a final file list and suggested next steps (`git init`, install deps, etc.) — but NOT execute them.
4. Surface the agent's report to the user.

## Refuse if

- The current working directory is the user's home directory or root — refuse and ask for a project directory.
- The target directory already contains a `.git/` folder AND files would be overwritten — refuse unless the user passes `--force` (the agent confirms interactively).
