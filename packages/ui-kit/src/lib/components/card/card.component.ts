import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

export type UiCardVariant = 'elevated' | 'outlined' | 'filled' | 'plain';
export type UiCardPadding = 'none' | 'sm' | 'md' | 'lg';

const INTERACTIVE_TARGETS = 'button, a, input, select, textarea, [data-ui-card-ignore]';

@Component({
  selector: 'ui-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-card--elevated]': "variant === 'elevated'",
    '[class.ui-card--outlined]': "variant === 'outlined'",
    '[class.ui-card--filled]': "variant === 'filled'",
    '[class.ui-card--plain]': "variant === 'plain'",
    '[class.ui-card--pad-none]': "padding === 'none'",
    '[class.ui-card--pad-sm]': "padding === 'sm'",
    '[class.ui-card--pad-md]': "padding === 'md'",
    '[class.ui-card--pad-lg]': "padding === 'lg'",
    '[class.ui-card--interactive]': 'interactive',
    '[class.ui-card--selected]': 'selected',
    '[attr.tabindex]': 'interactive ? 0 : null',
    '[attr.role]': "interactive ? 'button' : null",
  },
})
export class UiCardComponent {
  @Input() variant: UiCardVariant = 'elevated';
  @Input() padding: UiCardPadding = 'md';
  @Input({ transform: booleanAttribute }) interactive = false;
  @Input({ transform: booleanAttribute }) selected = false;

  @Output() readonly clicked = new EventEmitter<MouseEvent | KeyboardEvent>();

  @HostListener('click', ['$event'])
  protected onHostClick(event: MouseEvent): void {
    if (!this.interactive) {
      return;
    }
    const target = event.target as HTMLElement | null;
    if (target?.closest(INTERACTIVE_TARGETS)) {
      return;
    }
    this.clicked.emit(event);
  }

  @HostListener('keydown', ['$event'])
  protected onHostKeydown(event: KeyboardEvent): void {
    if (!this.interactive || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }
    event.preventDefault();
    this.clicked.emit(event);
  }
}
