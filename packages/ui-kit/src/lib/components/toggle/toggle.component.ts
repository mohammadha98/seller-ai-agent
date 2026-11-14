import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { nextUiId } from '../../utils/unique-id';

export type UiToggleSize = 'sm' | 'md';

@Component({
  selector: 'ui-toggle',
  standalone: true,
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-toggle-host--sm]': "size === 'sm'",
    '[class.ui-toggle-host--md]': "size === 'md'",
  },
})
export class UiToggleComponent {
  @Input() label = '';
  @Input() hint = '';
  @Input() name: string | null = null;
  @Input() toggleId: string | null = null;
  @Input() size: UiToggleSize = 'md';
  @Input({ transform: booleanAttribute }) checked = false;
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() readonly checkedChange = new EventEmitter<boolean>();
  @Output() readonly blurred = new EventEmitter<FocusEvent>();

  private readonly generatedId = nextUiId('toggle');

  get resolvedId(): string {
    return this.toggleId ?? this.generatedId;
  }

  protected get hintId(): string {
    return `${this.resolvedId}-hint`;
  }

  protected onChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.checked = checked;
    this.checkedChange.emit(checked);
  }

  protected onBlur(event: FocusEvent): void {
    this.blurred.emit(event);
  }
}
