import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  numberAttribute,
  Output,
} from '@angular/core';
import { UiControlSize } from '../../types/control-size';
import { nextUiId } from '../../utils/unique-id';

export type UiInputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
export type UiInputMode = 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';

@Component({
  selector: 'ui-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiInputComponent {
  @Input() label = '';
  @Input() hint = '';
  @Input() error: string | null = null;
  @Input() placeholder = '';
  @Input() type: UiInputType = 'text';
  @Input() inputMode: UiInputMode | null = null;
  @Input() value = '';
  @Input() name: string | null = null;
  @Input() inputId: string | null = null;
  @Input() autocomplete: string | null = null;
  @Input({ transform: numberAttribute }) maxLength: number | null = null;
  @Input() size: UiControlSize = 'md';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) readonly = false;
  @Input({ transform: booleanAttribute }) required = false;

  @Output() readonly valueChange = new EventEmitter<string>();
  @Output() readonly focused = new EventEmitter<FocusEvent>();
  @Output() readonly blurred = new EventEmitter<FocusEvent>();

  private readonly generatedId = nextUiId('input');

  get resolvedId(): string {
    return this.inputId ?? this.generatedId;
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

  protected get isInvalid(): boolean {
    return !!this.error;
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
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
