import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

export type UiAlertVariant = 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'ui-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-alert-host--dismissible]': 'dismissible',
  },
})
export class UiAlertComponent {
  @Input() variant: UiAlertVariant = 'info';
  @Input() title = '';
  @Input() dismissLabel = 'Dismiss';
  @Input({ transform: booleanAttribute }) dismissible = false;
  @Input({ transform: booleanAttribute }) showIcon = true;

  @Output() readonly dismissed = new EventEmitter<void>();

  @ContentChild('[uiAlertIcon]')
  protected readonly customIcon?: ElementRef<HTMLElement>;

  protected get role(): 'alert' | 'status' {
    return this.variant === 'danger' || this.variant === 'warning' ? 'alert' : 'status';
  }

  protected dismiss(): void {
    this.dismissed.emit();
  }
}
