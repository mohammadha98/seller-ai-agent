import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { UiControlSize } from '../../types/control-size';
import { nextUiId } from '../../utils/unique-id';

export interface UiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'ui-select',
  standalone: true,
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSelectComponent {
  @Input() label = '';
  @Input() hint = '';
  @Input() error: string | null = null;
  @Input() placeholder = '';
  @Input() options: readonly UiSelectOption[] = [];
  @Input() value: string | null = null;
  @Input() name: string | null = null;
  @Input() selectId: string | null = null;
  @Input() size: UiControlSize = 'md';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) required = false;

  @Output() readonly valueChange = new EventEmitter<string | null>();
  @Output() readonly focused = new EventEmitter<FocusEvent>();
  @Output() readonly blurred = new EventEmitter<FocusEvent>();

  private readonly generatedId = nextUiId('select');

  get resolvedId(): string {
    return this.selectId ?? this.generatedId;
  }

  protected get hintId(): string {
    return `${this.resolvedId}-hint`;
  }

  protected get errorId(): string {
    return `${this.resolvedId}-error`;
  }

  protected get describedBy(): string | null {
    if (this.error) {
      return this.errorId;
    }
    return this.hint ? this.hintId : null;
  }

  protected onChange(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    const value = raw === '' ? null : raw;
    this.value = value;
    this.valueChange.emit(value);
  }

  protected onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.blurred.emit(event);
  }
}
