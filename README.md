# cc-plugins

A marketplace of Claude Code plugins for pragmatic engineering workflows.

## Demo

<video src="https://github.com/kssd/cc-plugins/releases/download/v0.1-demo/demo.mp4" controls width="100%"></video>

## Plugins

| Plugin                           | Description                                                                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [`sdd`](./plugins/sdd)           | Spec-Driven Development — constitution, specs, clarify, plan, tasks, implement, sync, trace.                                        |
| [`scaffold`](./plugins/scaffold) | Initialize a new repo with best-practice defaults (gitignore, README, LICENSE, editorconfig, devcontainer, linters/formatters, CI). |

## Install

From inside Claude Code:

```text
/plugin marketplace add /path/to/this/repo
/plugin install sdd@cc-plugins
```

Or from GitHub:

```text
/plugin marketplace add kssd/cc-plugins
/plugin install sdd@cc-plugins
/plugin install scaffold@cc-plugins
```

## Develop

Each plugin lives under `plugins/<name>/`. The marketplace manifest is at `.claude-plugin/marketplace.json`. See [Claude Code plugin docs](https://code.claude.com/docs/en/plugins.md).
