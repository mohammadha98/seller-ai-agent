import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { nextUiId } from '../../utils/unique-id';

@Component({
  selector: 'ui-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCheckboxComponent {
  @Input() label = '';
  @Input() hint = '';
  @Input() error: string | null = null;
  @Input() name: string | null = null;
  @Input() checkboxId: string | null = null;
  @Input({ transform: booleanAttribute }) checked = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) required = false;

  @Output() readonly checkedChange = new EventEmitter<boolean>();
  @Output() readonly blurred = new EventEmitter<FocusEvent>();

  private readonly generatedId = nextUiId('checkbox');
  private checkbox: ElementRef<HTMLInputElement> | null = null;
  private indeterminateState = false;

  @ViewChild('checkboxRef')
  set checkboxRef(ref: ElementRef<HTMLInputElement> | undefined) {
    this.checkbox = ref ?? null;
    this.syncIndeterminate();
  }

  @Input({ transform: booleanAttribute })
  set indeterminate(value: boolean) {
    this.indeterminateState = value;
    this.syncIndeterminate();
  }

  get indeterminate(): boolean {
    return this.indeterminateState;
  }

  get resolvedId(): string {
    return this.checkboxId ?? this.generatedId;
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
    const checked = (event.target as HTMLInputElement).checked;
    this.checked = checked;
    this.checkedChange.emit(checked);
  }

  protected onBlur(event: FocusEvent): void {
    this.blurred.emit(event);
  }

  private syncIndeterminate(): void {
    if (this.checkbox) {
      this.checkbox.nativeElement.indeterminate = this.indeterminateState;
    }
  }
}
