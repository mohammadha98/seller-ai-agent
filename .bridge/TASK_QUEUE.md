# Task Queue

Pull the latest shared state before claiming a task. The Core Agent creates and assigns tasks; the assigned agent records its claim, then updates status as work progresses. Add the branch and PR link when available.

Status values: `Unclaimed`, `Claimed`, `In Progress`, `Blocked`, `In Review`, `Done`.

Rules:

- One row per atomic deliverable. Do not edit another agent's row except to add a dependency note the Core Agent requested.
- A task is `In Progress` only when its owner has claimed it and started work. `Blocked` rows list the blocking task IDs.
- A task is `Done` only after the structural review in `.bridge/REVIEW_LOG.md` passes.
- Record contract changes in `.bridge/API_CONTRACTS.md` before dependent work starts.

| Task ID | Description | Assigned Agent | Status | Dependencies | Branch / PR |
| --- | --- | --- | --- | --- | --- |
| TASK-001 | Implement the NestJS product catalog API: CRUD endpoints, DTO validation, in-memory store, service unit tests. Acceptance: FR-CAT-1 and section 6.1 of `docs/REQUIREMENTS.md`. | Backend Agent | In Progress | None | `implement-nestjs-product-management` (work uncommitted at review time) |
| TASK-002 | Confirm the product API contract and publish it in `.bridge/API_CONTRACTS.md`, resolving OQ-1 through OQ-4. Coordinate acknowledgment with the Services Agent. | Backend Agent | In Progress | TASK-001 | Same branch as TASK-001 |
| TASK-003 | Add controller or e2e coverage for the catalog endpoints: status codes, validation failures, 404 paths, and delete behavior. | Backend Agent | Unclaimed | TASK-001 | None |
| TASK-004 | Define design tokens for color, typography, spacing, radius, and elevation in `packages/ui-kit`. | Design System Agent | Unclaimed | None | `design-system` |
| TASK-005 | Build reusable design-system primitives: button, card, input, badge, spinner, and empty/error state. | Design System Agent | Unclaimed | TASK-004 | `design-system` |
| TASK-006 | Scaffold the Angular app in `apps/web`: workspace config, app shell, routing, and lint/test scripts. Do not implement catalog features. | UI Agent | In Review | None | `ui` (b24edb7) |
| TASK-007 | Implement the typed product API client and shared product types in `apps/web/src/services` and `apps/web/src/types`, with error normalization and configurable base URL. Acknowledge TASK-002 before starting. | Services Agent | Blocked | TASK-002, TASK-006 | None |
| TASK-008 | Implement the storefront product list page with active-product filtering, loading, empty, and error states, linking to detail. | UI Agent | Blocked | TASK-005, TASK-007 | None |
| TASK-009 | Implement the product detail page with product data and a not-found state. | UI Agent | Blocked | TASK-005, TASK-007 | None |
| TASK-010 | Complete the catalog responsive and accessibility pass across list and detail pages, including keyboard and screen-reader checks. | UI Agent | Blocked | TASK-008, TASK-009 | None |
| TASK-011 | Maintain requirements, boundaries, architecture, and the structural review gate; obtain the authoritative SRS and resolve OQ-5. | Core Agent | In Progress | None | `devcore` |

## Task notes

- TASK-001 through TASK-003 belong to the Backend Agent and must remain inside `apps/api`. The root `package-lock.json` may change as a result of installing workspace dependencies; include it in the task commit.
- TASK-004 and TASK-005 must not reference `apps/*` imports. The UI Agent consumes published package exports.
- TASK-006 owns the Angular scaffold, but `apps/web/src/services`, `apps/web/src/types`, and `apps/web/src/environments` belong to the Services Agent once scaffolded.
- TASK-008 and TASK-009 depend on both the design primitives and the typed client. Start them only after the blocking rows are `Done`, or record an explicit mock-data exception in the task row.
- TASK-011 includes intake of the authoritative SRS. This queue reflects the current repository evidence, not a finalized product spec.
- TASK-006 verification on `ui` (b24edb7): `npm run build --workspace=@ai-shop/web` (lazy home and not-found chunks emitted), `npm run lint --workspace=@ai-shop/web` (pass), and `npm run test --workspace=@ai-shop/web` (3 files, 4 tests passing). No catalog routes or UI-kit/service imports were added; those remain gated on TASK-005 and TASK-007.
