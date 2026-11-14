# Architecture and Agent Coordination

## Purpose and stack

AI Shop Salesman MVP uses a monorepo with npm workspaces. The backend uses NestJS, the frontend uses Angular, and the shared design system and tokens live in a separate package. Increment 1 establishes the product catalog foundation; the conversational AI sales assistant is a later increment with its own requirements and contract.

## Repository structure

```text
/
|-- apps/
|   |-- api/                 NestJS backend
|   `-- web/                 Angular frontend
|-- packages/
|   `-- ui-kit/              Shared design system and tokens
|-- docs/
|   `-- REQUIREMENTS.md      Increment 1 requirements and open questions
|-- .bridge/
|   |-- ARCHITECTURE.md      Architecture and collaboration protocol
|   |-- AGENT_BOUNDARIES.md  Ownership and access constraints
|   |-- TASK_QUEUE.md        Task claims, dependencies, status, and PR links
|   |-- API_CONTRACTS.md     Backend and Services schema negotiation
|   `-- REVIEW_LOG.md        Core Agent structural review decisions
|-- .gitignore
|-- package.json            Private npm workspace root
`-- README.md
```

The root workspace patterns are `apps/*` and `packages/*`. Each workspace has its own private `package.json`; only the owning agent edits it. The Core Agent maintains `docs` and may add further project documentation there.

## Separation of concerns

Follow [AGENT_BOUNDARIES.md](AGENT_BOUNDARIES.md) strictly. Shared design primitives and tokens belong to the Design System Agent, frontend service integrations and shared types to the Services Agent, frontend pages, features, and app shell to the UI Agent, and backend implementation to the Backend Agent. The Core Agent manages coordination documents, project documentation, and root settings without writing product code.

All agents may read shared state. Only the owning agent writes product code in its paths. Coordination updates do not transfer ownership of another agent's product code.

## Git-based communication protocol

All agents must read and write shared `.bridge` state through Git pull/push. Local-only changes are not shared coordination state.

1. Pull the latest shared Git state before claiming a task or editing coordination documents. Read this file, `AGENT_BOUNDARIES.md`, `TASK_QUEUE.md`, `API_CONTRACTS.md`, and the relevant requirements.
2. Claim an assigned task in `TASK_QUEUE.md` by recording the agent and status. Commit and push the claim so other agents can see it before starting overlapping work.
3. Respect path ownership throughout implementation. Record cross-agent requirements in `.bridge` instead of modifying another agent's product code.
4. The Backend and Services agents must agree on API schemas in `API_CONTRACTS.md` before implementing dependent integration work. A contract is usable only when its status is `Agreed`.
5. Commit related coordination changes with the work, push the working branch, and update the task status and PR link.
6. On conflicting task claims or contracts, stop the affected work, pull the latest state, and resolve the conflict with the responsible agents before continuing. Do not overwrite another agent's claim or contract agreement.

## Branch and integration workflow

1. Domain agents work on a branch created from the current `main`, or on the Agent Manager branch assigned to their worktree. Do not commit directly to `main`.
2. Open a PR into `main` when the task is ready for review. The PR description names the task ID, lists dependency tasks, and states the verification commands that passed.
3. The Core Agent performs a structural review and records the decision in `.bridge/REVIEW_LOG.md`.
4. The Core Agent merges only after the structural review passes and all dependency tasks are `Done`. Domain agents do not self-merge.
5. After merge, the owning agent updates the task to `Done` with the merge commit or PR link.

## Contract-first rule

Any endpoint, request field, response field, status code, or error shape consumed across domains is a contract. The Backend Agent proposes it in `API_CONTRACTS.md`, the Services Agent acknowledges it or requests changes, and the UI Agent consumes only the types published by Services. A contract change requires a new dated revision before dependent work continues.

## Definition of done

A task is done only when all of the following hold:

1. The implementation satisfies its requirement and acceptance criteria.
2. All changed paths are inside the owner's boundary.
3. The task row in `TASK_QUEUE.md` records the branch and PR, and is updated to `Done`.
4. Required contract revisions are recorded and `Agreed`.
5. The owner ran the relevant build, lint, and tests and reported the commands and results in the PR.
6. No secrets, generated artifacts, or unrelated files are committed.
7. The Core Agent recorded a passing structural review in `REVIEW_LOG.md`.

## Structural review gate

The Core Agent checks the following before any merge to `main`:

- [ ] Every changed path belongs to the PR author's owned paths; shared/root changes are declared.
- [ ] No product code was added to `.bridge`, `docs`, or root configuration.
- [ ] The task row, branch, and PR link are correct, and dependencies are `Done`.
- [ ] API-affecting changes have an `Agreed` contract revision.
- [ ] The PR reports passing build, lint, and test commands.
- [ ] No secrets, `node_modules`, `dist`, coverage, or editor files are included.
- [ ] The change matches the linked requirement and does not silently expand scope.

A failed gate is recorded in `REVIEW_LOG.md` with blocking conditions. The Core Agent does not merge until they are resolved.

## Dependency and lockfile workflow

The root `package.json` and root configuration are Core-owned. A domain agent may add dependencies only to its own workspace manifest. Running `npm install` from the root may update `package-lock.json`; the initiating agent includes that change in its task commit and declares it in the PR. The Core Agent checks that the lockfile change is limited to the declared dependency work.
