# Architecture and Agent Coordination

## Purpose and stack

AI Shop Salesman MVP uses a monorepo with npm workspaces. The backend will use NestJS, the frontend will use Angular, and the shared design system and tokens will live in a separate package. This initial scaffold contains no product code or framework dependencies.

## Repository structure

```text
/
|-- apps/
|   |-- api/                 NestJS backend placeholder
|   `-- web/                 Angular frontend placeholder
|-- packages/
|   `-- ui-kit/              Shared design system and tokens placeholder
|-- .bridge/
|   |-- ARCHITECTURE.md      Architecture and collaboration protocol
|   |-- AGENT_BOUNDARIES.md  Ownership and access constraints
|   |-- TASK_QUEUE.md        Task claims, status, and PR links
|   `-- API_CONTRACTS.md     Backend and Services schema negotiation
|-- .gitignore
|-- package.json            Private npm workspace root
`-- README.md
```

The root workspace patterns are `apps/*` and `packages/*`. Each placeholder has its own private `package.json`. Framework generation and dependency selection are deferred to the responsible domain agents. Future frontend services belong in `apps/web/src/services`, and pages and features belong in `apps/web/src/pages`. The Core Agent may add project documentation under `docs` when needed.

## Separation of concerns

Follow [AGENT_BOUNDARIES.md](AGENT_BOUNDARIES.md) strictly. Each agent changes product code only within its owned paths. Shared design primitives and tokens belong to the Design System Agent, frontend service integrations and types to the Services Agent, frontend pages and features to the UI Agent, and backend implementation to the Backend Agent. The Core Agent manages coordination documents, project documentation, and root settings without writing product code.

The Core Agent maintains the `.bridge` structure and governance. All agents may update their own task rows, and the Backend and Services agents may negotiate schemas in `API_CONTRACTS.md`. These coordination updates do not transfer ownership of other agents' product code.

## Git-based communication protocol

All agents must read and write shared `.bridge` state through Git pull/push. Local-only changes are not shared coordination state.

1. Pull the latest shared Git state before claiming a task or editing coordination documents. Read this file, `AGENT_BOUNDARIES.md`, `TASK_QUEUE.md`, and relevant API contracts.
2. Claim a task in `TASK_QUEUE.md` by recording the assigned agent and status. Commit and push the claim so other agents can see it before starting overlapping work.
3. Respect path ownership throughout implementation. Record cross-agent requirements in `.bridge` instead of modifying another agent's product code.
4. The Backend and Services agents must agree on API schemas in `API_CONTRACTS.md` before implementing dependent integration work. The file starts empty intentionally.
5. Commit related coordination changes with the work, push the working branch, and update the task status and PR link. Integrate shared branch changes through the team's review process.
6. On conflicting task claims or contracts, stop the affected work, pull the latest state, and resolve the conflict with the responsible agents before continuing. Do not overwrite another agent's claim or contract agreement.

The initial repository is local. Configure a shared remote and agree on a shared integration branch before beginning multi-agent work. Never claim to have synchronized state until the pull/push succeeds.
