# AI Shop Salesman MVP — Requirements

| Field | Value |
| --- | --- |
| Status | Draft for agent execution |
| Owner | Core Agent |
| Last updated | 2026-11-14 |
| Source | No standalone SRS was present in the repository. This draft is derived from the repository README, the monorepo scaffold, and the in-flight product-management work on `implement-nestjs-product-management`. Confirm or replace it when the authoritative SRS is available. |

## 1. Product context

AI Shop Salesman is a storefront where shop owners manage a product catalog and shoppers discover products. The differentiating conversational sales experience depends on a trustworthy catalog, so the first increment establishes the catalog foundation that later AI features will read from.

## 2. Increment 1 goals

1. A shop owner can create, read, update, and delete products through a documented HTTP API.
2. A shopper can browse a storefront product list and open a product detail view.
3. Frontend, backend, and design system share stable contracts and reusable primitives.

Deferred until a later increment: authentication and roles, payments and checkout, persistent storage, and the conversational AI sales assistant. The AI assistant requires its own requirements and contract before implementation starts.

## 3. Personas

| Persona | Need |
| --- | --- |
| Shop owner | Maintain an accurate product catalog without editing code or data files. |
| Shopper | Browse available products, understand price and availability, and inspect a product. |
| AI sales assistant (future) | Read catalog data through the same contracts used by the storefront. |

## 4. Functional requirements

### FR-CAT-1 — Product catalog API

The backend exposes REST endpoints to create, list, fetch, update, and delete products. A product has:

| Field | Type | Rules |
| --- | --- | --- |
| `id` | UUID string | Server-generated, immutable |
| `name` | string | Required, non-empty |
| `description` | string | Required for now; optionality is an open question |
| `price` | number | Required, `>= 0`, at most two decimal places |
| `stock` | integer | Required, `>= 0` |
| `isActive` | boolean | Defaults to `true`; used to hide unavailable products from shoppers |

Deleting a missing product and fetching a missing product both return `404`. Invalid payloads return `400` with a structured error body. Unknown fields are rejected.

### FR-CAT-2 — Storefront product list

The storefront shows active products with name, price, stock status, and a link to detail. Only products with `isActive = true` are shown to shoppers. The page handles loading, empty, and error states and works on mobile and desktop widths.

### FR-CAT-3 — Product detail

The storefront shows the selected product's name, description, price, stock status, and active state. A missing or inactive product shows a not-found state rather than a blank page.

### FR-CAT-4 — Typed frontend API access

All HTTP access to the catalog goes through a typed frontend service layer. Pages do not call `HttpClient` directly and do not duplicate response models. API errors are normalized for display.

### FR-CAT-5 — Shared design system

The design system provides tokens for color, spacing, typography, radius, and elevation, plus reusable primitives for buttons, cards, inputs, badges, loading indicators, and empty/error states. Product pages consume these primitives instead of one-off styles.

### FR-CAT-6 — Accessibility and responsiveness

Catalog pages meet WCAG 2.1 AA for the implemented flows: keyboard navigation, visible focus, semantic landmarks, labeled controls, sufficient contrast, and text alternatives. Layouts are usable from 360 px to desktop widths.

## 5. Non-functional requirements

| Area | Requirement |
| --- | --- |
| API style | JSON over HTTP, versionable paths, consistent status codes and error shape |
| Validation | Server-side validation is authoritative; client validation improves UX only |
| Persistence | In-memory storage is acceptable for Increment 1 and must be documented as volatile |
| Tests | Backend service tests cover catalog behavior; controller or e2e coverage is added before merge |
| Security | No secrets in the repository; permissive CORS is development-only and must be tightened before production |
| Tooling | Framework scaffolds live only in their owned workspaces; generated artifacts are never committed |
| Contracts | Backend and Services agree on the API contract before dependent frontend work merges |

## 6. Acceptance criteria for Increment 1

1. `POST /products`, `GET /products`, `GET /products/:id`, `PATCH /products/:id`, and `DELETE /products/:id` behave as specified, and the contract is recorded in `.bridge/API_CONTRACTS.md`.
2. A catalog page lists active products from the API and links to a detail page.
3. The detail page renders a single product and shows a not-found state for unknown IDs.
4. All catalog HTTP access is behind the Services-owned typed client.
5. Catalog pages use design-system primitives and tokens.
6. Backend tests pass, the frontend builds, and no agent writes outside its owned paths.
7. The Core Agent records a structural review before any merge to `main`.

## 7. Assumptions

- Single currency; currency display is a frontend concern until a backend field is agreed.
- `description` is required for now because the current DTO requires it.
- No authentication in Increment 1; admin-only operations are deferred.
- No pagination, search, or sorting in Increment 1 unless the contract owners agree to add them.
- The AI sales assistant is out of scope for Increment 1.

## 8. Open questions

| ID | Question | Owner | Blocks |
| --- | --- | --- | --- |
| OQ-1 | Should shoppers receive only active products from the API, or should the frontend filter? | Backend + Services | TASK-002, TASK-005 |
| OQ-2 | Is `description` optional? | Backend | TASK-002 |
| OQ-3 | Is a `currency` field required, or is currency fixed for the MVP? | Backend + Services | TASK-002 |
| OQ-4 | Should list responses support pagination or search in Increment 1? | Backend + Services | TASK-002 |
| OQ-5 | What are the authoritative requirements for the conversational AI sales assistant? | Core + stakeholders | Future increment |

## 9. Traceability

Task IDs in [.bridge/TASK_QUEUE.md](../.bridge/TASK_QUEUE.md) map to these requirements. The structural merge gate and definition of done live in [.bridge/ARCHITECTURE.md](../.bridge/ARCHITECTURE.md).
