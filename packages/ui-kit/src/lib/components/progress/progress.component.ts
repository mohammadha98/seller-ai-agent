import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Input,
  numberAttribute,
} from '@angular/core';

export type UiProgressVariant = 'brand' | 'success' | 'warning' | 'danger';
export type UiProgressSize = 'sm' | 'md';

@Component({
  selector: 'ui-progress',
  standalone: true,
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiProgressComponent {
  @Input({ transform: numberAttribute }) value = 0;
  @Input({ transform: numberAttribute }) max = 100;
  @Input() label = '';
  @Input() ariaLabel = 'Progress';
  @Input() variant: UiProgressVariant = 'brand';
  @Input() size: UiProgressSize = 'md';
  @Input({ transform: booleanAttribute }) showValue = false;
  @Input({ transform: booleanAttribute }) indeterminate = false;

  protected get safeMax(): number {
    return this.max > 0 ? this.max : 100;
  }

  protected get safeValue(): number {
    return Math.min(Math.max(this.value, 0), this.safeMax);
  }

  get percentage(): number {
    return (this.safeValue / this.safeMax) * 100;
  }

  protected get valueText(): string {
    return `${Math.round(this.percentage)}%`;
  }
}
