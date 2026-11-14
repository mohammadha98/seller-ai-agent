import { booleanAttribute, ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type UiSpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
export type UiSpinnerTone = 'brand' | 'neutral' | 'inverse' | 'current';

@Component({
  selector: 'ui-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSpinnerComponent {
  @Input() size: UiSpinnerSize = 'md';
  @Input() tone: UiSpinnerTone = 'brand';
  @Input() label = 'Loading';
  @Input({ transform: booleanAttribute }) decorative = false;
}
