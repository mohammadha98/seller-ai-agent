let sequence = 0;

export function nextUiId(prefix: string): string {
  sequence += 1;
  return `ui-${prefix}-${sequence}`;
}
