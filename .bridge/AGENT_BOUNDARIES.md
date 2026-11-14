# Agent Boundaries

Each path has exactly one writing owner. Every agent may read the whole repository, but may write only inside its owned paths. Cross-boundary changes are requested through `.bridge/TASK_QUEUE.md`, never made directly.

## Ownership matrix

| Agent | Owns (write) | Must not write |
| --- | --- | --- |
| Design System Agent | `packages/ui-kit/**` | `apps/**`, `.bridge/**`, `docs/**`, root files |
| Services Agent | `apps/web/src/services/**`, `apps/web/src/types/**`, `apps/web/src/environments/**` | `packages/ui-kit/**`, `apps/api/**`, `apps/web/src/pages/**`, `apps/web/src/features/**`, `.bridge/**`, root files |
| UI Agent | `apps/web/**` except the Services-owned paths above | `packages/ui-kit/**`, `apps/api/**`, `.bridge/**`, `docs/**`, root files |
| Backend Agent | `apps/api/**` | `apps/web/**`, `packages/ui-kit/**`, `.bridge/**`, `docs/**`, root files |
| Core Agent | `.bridge/**`, `docs/**`, root configuration (`package.json`, `package-lock.json`, `.gitignore`, `README.md`) | `apps/**`, `packages/**` |

## Shared and root files

- Workspace manifests: an agent may edit only its own workspace `package.json` (`apps/api`, `apps/web`, or `packages/ui-kit`). The root `package.json` is Core-owned.
- Root lockfile: running `npm install` from the root may update `package-lock.json`. This is allowed as a side effect of adding workspace dependencies, but the change must be included in the task commit and called out in the PR description. No agent may hand-edit the lockfile.
- Root tooling and documentation: `README.md`, `.gitignore`, and root configuration belong to the Core Agent. Request changes through a task instead of editing them.
- Generated artifacts: `node_modules/`, `dist/`, `coverage/`, and other ignored outputs are never committed. Deleting or regenerating them is not a product change.

## Coordination files

- `.bridge/TASK_QUEUE.md`: Core Agent creates and assigns tasks. Each agent may update only its own task rows (status, branch, PR link), and must not rewrite or remove another agent's row.
- `.bridge/API_CONTRACTS.md`: Backend Agent owns the contract proposal; Services Agent records acknowledgment or requested changes. Neither agent modifies the other's text; append a dated revision instead. Core Agent maintains the file structure.
- `.bridge/ARCHITECTURE.md`, `.bridge/AGENT_BOUNDARIES.md`, `.bridge/REVIEW_LOG.md`: Core Agent-owned.
- `docs/**`: Core Agent-owned. Domain agents may propose changes through a task.

## Enforcement

1. Read this file and `.bridge/ARCHITECTURE.md` before starting work.
2. Keep every changed path inside the owned list. Moving, reformatting, or deleting another agent's files is a boundary violation even if the content is unchanged.
3. If a task cannot be completed without touching another agent's path, stop and add a dependency note to the task row. Do not make the edit.
4. The Core Agent blocks any PR with an out-of-bounds path change until the owning agent makes the change or the boundaries are formally updated.
