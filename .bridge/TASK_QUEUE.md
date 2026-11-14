# Task Queue

Pull the latest shared state before claiming a task. The Core Agent creates and assigns tasks; the assigned agent records its claim, then updates status as work progresses. Add the branch and PR link when available.

Status values: `Unclaimed`, `Claimed`, `In Progress`, `Ready for Dev`, `Blocked`, `In Review`, `Done`, `Merged`.

- `Ready for Dev`: dependencies are `Done` and the task is unblocked; the owner may claim it.
- `Done`: implementation is complete and the structural review passed; integration to `main` may still be pending.
- `Merged`: the work is integrated into `main`.

Rules:

- One row per atomic deliverable. Do not edit another agent's row except to add a dependency note the Core Agent requested.
- A task is `In Progress` only when its owner has claimed it and started work. `Blocked` rows list the blocking task IDs.
- A task is `Done` only after the structural review in `.bridge/REVIEW_LOG.md` passes.
- Record contract changes in `.bridge/API_CONTRACTS.md` before dependent work starts.
- Baseline approvals are recorded in `REVIEW-002`.

| Task ID | Description | Assigned Agent | Status | Dependencies | Branch / PR |
| --- | --- | --- | --- | --- | --- |
| TASK-001 | Implement the NestJS product catalog API: CRUD endpoints, DTO validation, in-memory store, service unit tests. Acceptance: FR-CAT-1 and section 6.1 of `docs/REQUIREMENTS.md`. | Backend Agent | Done | None | `implement-nestjs-product-management` @ `5aa40de` |
| TASK-002 | Confirm the product API contract and publish it in `.bridge/API_CONTRACTS.md`, resolving OQ-1 through OQ-4. | Backend Agent | Done | TASK-001 | `CONTRACT-001` Agreed (Backend `5aa40de` + Services acknowledgment) |
| TASK-003 | Add controller or e2e coverage for the catalog endpoints: status codes, validation failures, 404 paths, and delete behavior. | Backend Agent | Unclaimed | TASK-001 | Follow-up; no branch yet |
| TASK-004 | Define design tokens for color, typography, spacing, radius, and elevation in `packages/ui-kit`. | Design System Agent | Done | None | `design-system` @ `392a33e` |
| TASK-005 | Build reusable design-system primitives: button, card, input, badge, spinner, and empty/error state. | Design System Agent | Done | TASK-004 | `design-system` @ `392a33e` |
| TASK-006 | Scaffold the Angular app in `apps/web`: workspace config, app shell, routing, and lint/test scripts. Do not implement catalog features. | UI Agent | Done | None | `ui` @ `8cf959a` (head `65ac287`) |
| TASK-007 | Implement the typed product API client, shared product/error types, and signal state in `apps/web/src/services` and `apps/web/src/core`, with error normalization and a configurable base URL. | Services Agent | Done | TASK-002, TASK-006 | `frontend-services` @ `29e1518` |
| TASK-008 | Implement the storefront product list page. Consume `@ai-shop/ui-kit` components (`Card`, `Button`, `Badge`, `Spinner`, `EmptyState`) and the Services layer (`ProductService`/`ProductStore` in `apps/web/src/services` and `apps/web/src/core`). Do not call `HttpClient` directly or edit `packages/ui-kit/**` or the Services-owned paths. Show active products only with loading, empty, and error states, and link to detail. | UI Agent | Ready for Dev | TASK-005, TASK-007 | Start from the integrated baseline; no branch yet |
| TASK-009 | Implement the product detail page/card. Consume `@ai-shop/ui-kit` (`Card`, `Badge`, `Button`, `Spinner`, `EmptyState`) and `ProductService.getById`/`ProductStore`. Do not call `HttpClient` directly or edit `packages/ui-kit/**` or the Services-owned paths. Handle not-found and inactive products. | UI Agent | Ready for Dev | TASK-005, TASK-007 | Start from the integrated baseline; no branch yet |
| TASK-010 | Complete the catalog responsive and accessibility pass across list and detail pages, including keyboard and screen-reader checks. | UI Agent | Blocked | TASK-008, TASK-009 | None |
| TASK-011 | Maintain requirements, boundaries, architecture, and the structural review gate. Reconcile and commit the canonical root `package-lock.json` after baseline integration, and obtain the authoritative SRS to resolve OQ-5. | Core Agent | In Progress | None | `devcore` |

## Task notes

- **Baseline approvals:** Backend (`5aa40de`), Design System (`392a33e`), UI shell (`8cf959a` / head `65ac287`), and Services (`29e1518`) passed the structural boundary review in `REVIEW-002` and are approved for integration. No branch is merged into `main` yet.
- **UI catalog tasks are unblocked.** TASK-008 and TASK-009 are assigned to the UI Agent and may be claimed. Use the design-system exports and the Services layer; do not duplicate API models or call `HttpClient` in pages.
- **Integration order:** Backend, Design System, Services, then UI shell. After integration, the UI Agent should branch TASK-008 and TASK-009 from the integrated baseline so both `packages/ui-kit` and `apps/web/src/services`/`core` are present.
- **Root lockfile:** The Backend worktree left an untracked NestJS-only `package-lock.json`; the UI branch committed an Angular-only `package-lock.json`. Neither is final. The Core Agent owns root configuration and will regenerate and commit the canonical lockfile after manifest integration under TASK-011. Do not commit another partial root lockfile.
- **Boundary clarification:** `apps/web/src/core/**` (shared types and signal state) is Services-owned, as recorded in `AGENT_BOUNDARIES.md`. The UI Agent owns the app shell, pages, and features outside that path.
- TASK-001 through TASK-003 belong to the Backend Agent and must remain inside `apps/api`.
- TASK-004 and TASK-005 must not reference `apps/*` imports. The UI Agent consumes published package exports.
- TASK-006 verification on `ui` (`8cf959a`): `npm run build --workspace=@ai-shop/web` (lazy home and not-found chunks emitted), `npm run lint --workspace=@ai-shop/web` (pass), and `npm run test --workspace=@ai-shop/web` (3 files, 4 tests passing).
- TASK-011 includes intake of the authoritative SRS. This queue reflects the current repository evidence, not a finalized product spec.
