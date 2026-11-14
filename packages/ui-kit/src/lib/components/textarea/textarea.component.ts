import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  numberAttribute,
  Output,
} from '@angular/core';
import { nextUiId } from '../../utils/unique-id';

export type UiTextareaResize = 'none' | 'vertical' | 'both';

@Component({
  selector: 'ui-textarea',
  standalone: true,
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTextareaComponent {
  @Input() label = '';
  @Input() hint = '';
  @Input() error: string | null = null;
  @Input() placeholder = '';
  @Input() value = '';
  @Input() name: string | null = null;
  @Input() textareaId: string | null = null;
  @Input({ transform: numberAttribute }) rows = 4;
  @Input({ transform: numberAttribute }) maxLength: number | null = null;
  @Input() resize: UiTextareaResize = 'vertical';
  @Input({ transform: booleanAttribute }) showCounter = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) readonly = false;
  @Input({ transform: booleanAttribute }) required = false;

  @Output() readonly valueChange = new EventEmitter<string>();
  @Output() readonly focused = new EventEmitter<FocusEvent>();
  @Output() readonly blurred = new EventEmitter<FocusEvent>();

  private readonly generatedId = nextUiId('textarea');

  get resolvedId(): string {
    return this.textareaId ?? this.generatedId;
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

  protected get showMeta(): boolean {
    return !!this.error || !!this.hint || (this.showCounter && this.maxLength !== null);
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
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
