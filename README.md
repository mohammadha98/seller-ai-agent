# AI Shop Salesman MVP

This repository provides the initial monorepo structure for an AI shop salesman MVP, with a NestJS backend, an Angular frontend, and a shared design system.

Read [.bridge/ARCHITECTURE.md](.bridge/ARCHITECTURE.md) before making changes. All agents must follow the ownership rules in [.bridge/AGENT_BOUNDARIES.md](.bridge/AGENT_BOUNDARIES.md), coordinate work in [.bridge/TASK_QUEUE.md](.bridge/TASK_QUEUE.md), and negotiate API schemas in [.bridge/API_CONTRACTS.md](.bridge/API_CONTRACTS.md).

## Workspaces

| Path | Purpose | Owner |
| --- | --- | --- |
| `apps/api` | NestJS backend placeholder | Backend Agent |
| `apps/web` | Angular frontend placeholder | UI Agent and Services Agent, within their boundaries |
| `packages/ui-kit` | Shared design system and tokens placeholder | Design System Agent |
| `.bridge` | Git-based agent coordination and state | Core Agent |

The root uses npm workspaces for `apps/*` and `packages/*`. Each workspace currently contains only a private package manifest. No framework dependencies, application code, build scripts, or generated projects have been added. The Backend and UI agents will initialize their frameworks within their assigned directories; the Design System and Services agents will establish their owned areas.

No dependency installation is required to inspect this scaffold. Once dependencies are introduced, run `npm install` from the root and commit the root `package-lock.json`. Use `npm run <script> --workspace=<package-name>` for scripts added by the owning agents.

Before changing shared coordination state, pull the latest Git changes. Commit `.bridge` updates with the related work and push the working branch to the configured remote for other agents to read. A shared remote must be configured before cross-agent pull/push coordination can begin.
