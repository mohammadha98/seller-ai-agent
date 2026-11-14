import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { nextUiId } from '../../utils/unique-id';

export type UiTooltipPosition = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'ui-tooltip',
  standalone: true,
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-describedby]': 'text && !disabled ? resolvedId : null',
  },
})
export class UiTooltipComponent {
  @Input() text = '';
  @Input() position: UiTooltipPosition = 'top';
  @Input() tooltipId: string | null = null;
  @Input({ transform: booleanAttribute }) disabled = false;

  protected readonly generatedId = nextUiId('tooltip');

  get resolvedId(): string {
    return this.tooltipId ?? this.generatedId;
  }
}
