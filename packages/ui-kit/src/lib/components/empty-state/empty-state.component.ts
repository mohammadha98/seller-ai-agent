import { booleanAttribute, ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ui-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-empty-state-host--compact]': 'compact',
  },
})
export class UiEmptyStateComponent {
  @Input() title = '';
  @Input() description = '';
  @Input({ transform: booleanAttribute }) compact = false;
}
