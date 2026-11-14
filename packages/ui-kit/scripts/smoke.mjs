import { existsSync } from 'node:fs';

await import('@angular/compiler');

const kit = await import('../dist/fesm2022/ai-shop-ui-kit.mjs');

const expected = {
  UiAlertComponent: 'ui-alert',
  UiAvatarComponent: 'ui-avatar',
  UiBadgeComponent: 'ui-badge',
  UiButtonComponent: 'ui-button',
  UiCardComponent: 'ui-card',
  UiCheckboxComponent: 'ui-checkbox',
  UiEmptyStateComponent: 'ui-empty-state',
  UiInputComponent: 'ui-input',
  UiModalComponent: 'ui-modal',
  UiPaginationComponent: 'ui-pagination',
  UiProgressComponent: 'ui-progress',
  UiSelectComponent: 'ui-select',
  UiSkeletonComponent: 'ui-skeleton',
  UiSpinnerComponent: 'ui-spinner',
  UiTabsComponent: 'ui-tabs',
  UiTextareaComponent: 'ui-textarea',
  UiToggleComponent: 'ui-toggle',
  UiTooltipComponent: 'ui-tooltip',
};

for (const [className, selector] of Object.entries(expected)) {
  const component = kit[className];
  if (typeof component !== 'function') {
    throw new Error(`Missing export: ${className}`);
  }
  const selectors = component.ɵcmp?.selectors ?? [];
  if (!selectors.some((entry) => entry.includes(selector))) {
    throw new Error(`${className} is not registered as <${selector}>`);
  }
}

const styleAssets = [
  'theme.scss',
  '_tokens.scss',
  '_themes.scss',
  '_semantic.scss',
  '_palette.scss',
  '_forms.scss',
  '_index.scss',
];

for (const asset of styleAssets) {
  const url = new URL(`../dist/styles/${asset}`, import.meta.url);
  if (!existsSync(url)) {
    throw new Error(`Missing style asset: ${asset}`);
  }
}

console.log(`ui-kit smoke test passed: ${Object.keys(expected).length} components, ${styleAssets.length} style assets.`);
