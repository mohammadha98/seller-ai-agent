# @ai-shop/ui-kit

Shared Angular design system for the AI Shop Salesman frontend. The package contains stateless presentational components and the design tokens they consume.

## Principles

- Components are standalone, use `ChangeDetectionStrategy.OnPush`, and communicate only through `@Input()` and `@Output()`.
- No HTTP, state management, routing, or business services are injected. Data flows in from the host page and events flow out.
- Styling relies on CSS custom properties for themeable values and SCSS partials for structure, so applications can theme the kit without forking component styles.
- Every component is exported from the package root. Import only what a page needs.

## Requirements

- Angular `^22.0.0` (`@angular/core` and `@angular/common` are peer dependencies).
- SCSS support in the consuming application.
- Node `^22.22.3 || ^24.15.0 || >=26.0.0` for local development.
- TypeScript `>=6.0 <6.1` for local development.

## Development

```bash
npm install
npm run build
npm run typecheck
npm run smoke
npm run verify
```

`npm run build` uses ng-packagr and writes the compiled package to `packages/ui-kit/dist`. `npm run smoke` imports the built output, checks that every component is exported with the expected selector, and verifies that the token assets were copied. `npm run verify` runs build, smoke, and typecheck in sequence. The `dist` directory is ignored by Git and must be rebuilt after changes when an application consumes the built artifacts.

## Consuming the package

The application and this library are npm workspaces. Because the package is an Angular library, applications consume the built output rather than the raw source.

1. Build the kit:

   ```bash
   npm run build --workspace=@ai-shop/ui-kit
   ```

2. Point the application TypeScript configuration at the built package. For `apps/web`, add mappings relative to the web workspace:

   ```json
   {
     "compilerOptions": {
       "paths": {
         "@ai-shop/ui-kit": ["../../packages/ui-kit/dist"]
       }
     }
   }
   ```

3. Import components directly from the package root:

   ```ts
   import { UiButtonComponent, UiCardComponent } from '@ai-shop/ui-kit';
   ```

4. Import standalone components in the page or feature component that uses them:

   ```ts
   @Component({
     selector: 'app-products-page',
     imports: [UiButtonComponent, UiCardComponent],
     templateUrl: './products-page.component.html',
   })
   export class ProductsPageComponent {}
   ```

## Theming

Import the token stylesheet once in the application's global styles. The recommended approach is a Sass `@use` in `apps/web/src/styles.scss`:

```scss
@use '../../../packages/ui-kit/src/lib/styles/theme';
```

After building the kit and linking the package from `dist`, a Sass load path that includes `node_modules` supports:

```scss
@use '@ai-shop/ui-kit/styles/theme';
```

The stylesheet emits the token variables for `:root` and `[data-ui-theme='light']`.

### Light and dark themes

The light theme is the default. Apply the dark theme to any container, typically `<html>`:

```html
<html data-ui-theme="dark"></html>
```

An application can opt into the system preference instead:

```html
<div class="ui-theme-auto"></div>
```

`styles/theme.scss` emits the `.ui-theme-auto` dark overrides inside `prefers-color-scheme: dark`. Use `[data-ui-theme]` for explicit user-controlled switches.

### Token categories

| Category | Variables | Notes |
| --- | --- | --- |
| Surfaces | `--ui-color-bg-canvas`, `--ui-color-bg-surface`, `--ui-color-bg-subtle`, `--ui-color-bg-muted`, `--ui-color-bg-elevated`, `--ui-color-bg-inverse` | Page, card, and overlay backgrounds |
| Text | `--ui-color-text-primary`, `--ui-color-text-secondary`, `--ui-color-text-tertiary`, `--ui-color-text-inverse`, `--ui-color-text-link` | Text hierarchy and links |
| Borders | `--ui-color-border-subtle`, `--ui-color-border`, `--ui-color-border-strong` | Dividers and control outlines |
| Brand | `--ui-color-primary`, `--ui-color-primary-hover`, `--ui-color-primary-active`, `--ui-color-primary-subtle`, `--ui-color-primary-subtle-hover`, `--ui-color-primary-contrast` | Primary actions and selection |
| Status | `--ui-color-success`, `--ui-color-warning`, `--ui-color-danger`, `--ui-color-info` plus `-subtle`, `-hover`, and `-contrast` variants | Alerts, badges, validation |
| Accent | `--ui-color-accent`, `--ui-color-accent-subtle`, `--ui-color-accent-contrast` | Highlight and promotional accents |
| Disabled | `--ui-color-disabled-bg`, `--ui-color-disabled-text`, `--ui-color-disabled-border` | Disabled controls |
| Focus | `--ui-color-focus-ring` | Shared focus treatment |
| Overlay | `--ui-color-overlay` | Modal backdrop |
| Spacing | `--ui-space-0` through `--ui-space-24` | 4px-based scale |
| Radius | `--ui-radius-xs`, `--ui-radius-sm`, `--ui-radius-md`, `--ui-radius-lg`, `--ui-radius-xl`, `--ui-radius-2xl`, `--ui-radius-full` | Corner rounding |
| Typography | `--ui-font-sans`, `--ui-font-display`, `--ui-font-mono`, `--ui-font-size-*`, `--ui-font-weight-*`, `--ui-line-height-*`, `--ui-letter-spacing-*` | Type scale |
| Shadows | `--ui-shadow-sm`, `--ui-shadow-md`, `--ui-shadow-lg`, `--ui-shadow-xl` | Elevation |
| Motion | `--ui-duration-*`, `--ui-easing-*` | Animation timing |
| Layering | `--ui-z-dropdown`, `--ui-z-sticky`, `--ui-z-overlay`, `--ui-z-modal`, `--ui-z-popover`, `--ui-z-tooltip`, `--ui-z-toast` | Stacking order |
| Layout | `--ui-control-height-sm`, `--ui-control-height-md`, `--ui-control-height-lg`, `--ui-container-max` | Control sizing and page width |

Override any token at application level:

```scss
:root {
  --ui-color-primary: #0f766e;
  --ui-color-primary-hover: #0d9488;
  --ui-font-sans: 'Inter', system-ui, sans-serif;
}
```

Component styles use `var(--token, fallback)` for theme values, so components remain usable in isolated previews before the theme stylesheet is loaded.

### SCSS utilities

`styles/_tokens.scss` exposes `@function` and `@mixin` helpers for application-level layout code:

```scss
@use '../../../packages/ui-kit/src/lib/styles/tokens' as ui;

.page {
  padding: ui.ui-space(6);
  gap: ui.ui-space(4);

  @include ui.respond-up(lg) {
    padding: ui.ui-space(10);
  }
}
```

When consuming the built package with a Sass load path that includes `node_modules`, the equivalent is:

```scss
@use '@ai-shop/ui-kit/styles/tokens' as ui;
```

Available helpers: `ui-space`, `ui-radius`, `ui-font-size`, `ui-line-height`, `ui-weight`, `ui-tracking`, `ui-duration`, `ui-easing`, `ui-z`, `ui-control-height`, `ui-color`, `ui-shadow`, `respond-up`, `focus-ring`, `visually-hidden`, `truncate`, `line-clamp`, and `reduced-motion`.

## Components

All components are standalone. Import them individually from `@ai-shop/ui-kit`.

### `ui-button`

```html
<ui-button variant="primary" size="md" (clicked)="save()">Save</ui-button>
<ui-button variant="outline" [loading]="saving">Saving</ui-button>
<ui-button variant="ghost" iconOnly ariaLabel="Close" (clicked)="close()">
  <svg aria-hidden="true" width="16" height="16">...</svg>
</ui-button>
```

Inputs: `variant` (`primary` | `secondary` | `outline` | `ghost` | `danger` | `link`), `size` (`sm` | `md` | `lg`), `type` (`button` | `submit` | `reset`), `disabled`, `loading`, `fullWidth`, `iconOnly`, `ariaLabel`, `title`.

Outputs: `clicked` (emits `MouseEvent` only when the button is interactive). Native click listeners on the host still receive enabled clicks; disabled and loading buttons block activation.

### `ui-card`

```html
<ui-card variant="outlined" padding="md">
  <img uiCardMedia src="/product.png" alt="" />
  <div uiCardHeader>
    <h3>Product title</h3>
  </div>
  <p>Body content is projected into the default slot.</p>
  <div uiCardFooter>
    <ui-button size="sm">Add to cart</ui-button>
  </div>
</ui-card>
```

Inputs: `variant` (`elevated` | `outlined` | `filled` | `plain`), `padding` (`none` | `sm` | `md` | `lg`), `interactive`, `selected`.

Outputs: `clicked` (emits for clicks on the card surface and for Enter/Space when `interactive`; clicks on buttons, links, inputs, selects, textareas, and `[data-ui-card-ignore]` elements are ignored). Prefer `interactive` for cards whose surface is the primary action; when a card contains its own controls, leave `interactive` off and bind those controls directly.

Slots: `[uiCardMedia]`, `[uiCardHeader]`, `[uiCardFooter]`, default body.

### `ui-badge`

```html
<ui-badge variant="success" appearance="soft" dot>Active</ui-badge>
```

Inputs: `variant` (`neutral` | `brand` | `accent` | `success` | `warning` | `danger` | `info`), `appearance` (`soft` | `solid` | `outline`), `size` (`sm` | `md`), `dot`.

### `ui-avatar`

```html
<ui-avatar name="Ada Lovelace" src="/avatar.png" size="md" status="online" />
```

Inputs: `src`, `alt`, `name`, `size` (`xs` | `sm` | `md` | `lg` | `xl`), `shape` (`circle` | `square`), `status` (`online` | `away` | `busy` | `offline` | `null`). Falls back to initials, then a user glyph, when the image fails or is absent.

### `ui-spinner`

```html
<ui-spinner size="md" tone="brand" label="Loading products" />
```

Inputs: `size` (`xs` | `sm` | `md` | `lg`), `tone` (`brand` | `neutral` | `inverse` | `current`), `label`, `decorative`. The label is announced through a visually hidden status region; set `decorative` when adjacent text already explains the state.

### `ui-skeleton`

```html
<ui-skeleton width="60%" />
<ui-skeleton shape="circle" width="2.5rem" height="2.5rem" />
```

Inputs: `width`, `height`, `shape` (`line` | `rect` | `circle`), `animated`. The host is hidden from assistive technology.

### `ui-input`

```html
<ui-input
  label="Store name"
  placeholder="My store"
  hint="Shown to buyers"
  [error]="nameError"
  [(value)]="name"
  required
/>
```

Inputs: `label`, `hint`, `error` (`string | null`), `placeholder`, `type` (`text` | `email` | `password` | `search` | `tel` | `url` | `number`), `inputMode`, `value`, `name`, `inputId`, `autocomplete`, `maxLength`, `size` (`sm` | `md` | `lg`), `disabled`, `readonly`, `required`.

Outputs: `valueChange` (string), `focused`, `blurred`.

Slots: `[uiInputPrefix]`, `[uiInputSuffix]` for inline icons or units.

### `ui-textarea`

```html
<ui-textarea label="Description" [(value)]="description" [maxLength]="500" showCounter />
```

Inputs: `label`, `hint`, `error`, `placeholder`, `value`, `name`, `textareaId`, `rows`, `maxLength`, `resize` (`none` | `vertical` | `both`), `showCounter`, `disabled`, `readonly`, `required`.

Outputs: `valueChange`, `focused`, `blurred`.

### `ui-select`

```ts
options: UiSelectOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
];
```

```html
<ui-select label="Status" [options]="options" [(value)]="status" placeholder="Choose a status" />
```

Inputs: `label`, `hint`, `error`, `placeholder`, `options` (`UiSelectOption[]`), `value` (`string | null`), `name`, `selectId`, `size`, `disabled`, `required`.

Outputs: `valueChange` (`string | null`), `focused`, `blurred`. An empty string from the placeholder option is normalized to `null`.

### `ui-checkbox`

```html
<ui-checkbox label="Notify buyers" hint="Send an email when stock arrives" [(checked)]="notify" />
```

Inputs: `label`, `hint`, `error`, `name`, `checkboxId`, `checked`, `indeterminate`, `disabled`, `required`.

Outputs: `checkedChange`, `blurred`.

### `ui-toggle`

```html
<ui-toggle label="AI auto-replies" [(checked)]="autoReplies" />
```

Inputs: `label`, `hint`, `name`, `toggleId`, `size` (`sm` | `md`), `checked`, `disabled`.

Outputs: `checkedChange`, `blurred`.

### `ui-alert`

```html
<ui-alert variant="warning" title="Low stock" dismissible (dismissed)="hideAlert()">
  Only 3 units remain for this listing.
</ui-alert>
```

Inputs: `variant` (`info` | `success` | `warning` | `danger`), `title`, `dismissLabel`, `dismissible`, `showIcon`.

Outputs: `dismissed`. Slots: `[uiAlertIcon]` to replace the default icon, `[uiAlertActions]` for buttons. Warning and danger variants use `role="alert"`.

### `ui-modal`

```html
<ui-modal
  [open]="isModalOpen"
  title="Delete listing"
  description="This action cannot be undone."
  size="md"
  (openChange)="isModalOpen = $event"
  (closed)="onModalClosed($event)"
>
  <p>Confirm that you want to delete the listing.</p>
  <div uiModalFooter>
    <ui-button variant="ghost" (clicked)="isModalOpen = false">Cancel</ui-button>
    <ui-button variant="danger" (clicked)="deleteListing()">Delete</ui-button>
  </div>
</ui-modal>
```

Inputs: `open`, `title`, `description`, `size` (`sm` | `md` | `lg` | `xl`), `ariaLabel`, `closeOnBackdrop`, `closeOnEscape`, `showClose`.

Outputs: `openChange` (boolean), `closed` (`UiModalCloseReason`: `backdrop` | `escape` | `close-button`). The component does not mutate `open`; the host must apply `openChange`. Focus moves into the dialog, Tab is trapped inside it, Escape and backdrop dismissal are configurable, and focus returns to the previously focused element on close. Body scroll locking is left to the host application.

Slots: default body, `[uiModalFooter]`.

### `ui-tooltip`

```html
<ui-tooltip text="Copy link" position="top">
  <ui-button variant="ghost" iconOnly ariaLabel="Copy link">...</ui-button>
</ui-tooltip>
```

Inputs: `text`, `position` (`top` | `right` | `bottom` | `left`), `tooltipId`, `disabled`. The tooltip appears on hover and focus-within after a short delay. Wrap a focusable element so keyboard users can discover it. Positioning is CSS-based with no automatic collision detection, so choose the side that keeps the tooltip inside the viewport at the edges of a layout.

### `ui-progress`

```html
<ui-progress [value]="42" [max]="100" label="Uploading images" showValue />
<ui-progress indeterminate label="Analyzing listing" />
```

Inputs: `value`, `max`, `label`, `ariaLabel`, `variant` (`brand` | `success` | `warning` | `danger`), `size` (`sm` | `md`), `showValue`, `indeterminate`.

### `ui-empty-state`

```html
<ui-empty-state title="No products yet" description="Add your first product to start selling.">
  <svg uiEmptyStateIcon>...</svg>
  <ui-button uiEmptyStateActions>Add product</ui-button>
</ui-empty-state>
```

Inputs: `title`, `description`, `compact`. Slots: `[uiEmptyStateIcon]`, `[uiEmptyStateActions]`.

### `ui-tabs`

```ts
tabs: UiTab[] = [
  { id: 'products', label: 'Products', badge: 12 },
  { id: 'orders', label: 'Orders' },
  { id: 'archived', label: 'Archived', disabled: true },
];
```

```html
<ui-tabs [tabs]="tabs" [(activeId)]="activeTab" variant="line" ariaLabel="Listing sections" />

@if (activeTab === 'products') {
  <div role="tabpanel" aria-label="Products" tabindex="0">...</div>
}
```

Inputs: `tabs` (`UiTab[]`), `activeId`, `variant` (`line` | `pill`), `size` (`sm` | `md`), `ariaLabel`.

Outputs: `activeIdChange`. Supports ArrowLeft, ArrowRight, Home, and End with automatic activation. Panels are rendered by the host page; add `role="tabpanel"` and an accessible name that matches the tab.

### `ui-pagination`

```html
<ui-pagination [pageCount]="totalPages" [(page)]="page" (pageChange)="load(page)" />
```

Inputs: `page`, `pageCount`, `siblingCount`, `size` (`sm` | `md`), `ariaLabel`, `disabled`.

Outputs: `pageChange`. The component emits the requested page and updates its own `page` value; bind `[(page)]` to keep the host and pagination in sync.

## Accessibility notes

- Interactive controls use native elements where possible, expose visible focus rings, and honor `prefers-reduced-motion`.
- Form controls connect labels, hints, and errors through `for`, `aria-describedby`, `aria-invalid`, and `aria-required`.
- Icons are decorative (`aria-hidden`) unless an `ariaLabel` is supplied.
- The modal traps focus, closes on Escape and backdrop by default, and restores focus to the trigger.
- Tooltips are supplementary; never place essential information only inside a tooltip. Tooltips do not support touch interaction.

## Repository integration

- Owned path: `packages/ui-kit`.
- No page, service, or API code is imported or modified by this package.
- Commit changes with the `feat(ui-kit):` or `fix(ui-kit):` prefix.
