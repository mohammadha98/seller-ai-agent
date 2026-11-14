import { booleanAttribute, ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type UiBadgeVariant =
  | 'neutral'
  | 'brand'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';
export type UiBadgeAppearance = 'soft' | 'solid' | 'outline';
export type UiBadgeSize = 'sm' | 'md';

@Component({
  selector: 'ui-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBadgeComponent {
  @Input() variant: UiBadgeVariant = 'neutral';
  @Input() appearance: UiBadgeAppearance = 'soft';
  @Input() size: UiBadgeSize = 'sm';
  @Input({ transform: booleanAttribute }) dot = false;
}
