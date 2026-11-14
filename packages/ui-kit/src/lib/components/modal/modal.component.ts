import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { nextUiId } from '../../utils/unique-id';

export type UiModalSize = 'sm' | 'md' | 'lg' | 'xl';
export type UiModalCloseReason = 'backdrop' | 'escape' | 'close-button';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

@Component({
  selector: 'ui-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiModalComponent implements OnChanges, AfterViewInit {
  @Input({ transform: booleanAttribute }) open = false;
  @Input() title = '';
  @Input() description = '';
  @Input() size: UiModalSize = 'md';
  @Input() ariaLabel = 'Dialog';
  @Input({ transform: booleanAttribute }) closeOnBackdrop = true;
  @Input({ transform: booleanAttribute }) closeOnEscape = true;
  @Input({ transform: booleanAttribute }) showClose = true;

  @Output() readonly openChange = new EventEmitter<boolean>();
  @Output() readonly closed = new EventEmitter<UiModalCloseReason>();

  @ViewChild('panel')
  private panel?: ElementRef<HTMLElement>;

  protected readonly titleId = nextUiId('modal-title');
  private previousFocus: HTMLElement | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['open'];
    if (!change) {
      return;
    }
    if (change.currentValue === true) {
      this.captureFocus();
      this.focusPanel();
    } else if (change.previousValue === true) {
      this.restoreFocus();
    }
  }

  ngAfterViewInit(): void {
    if (this.open) {
      this.focusPanel();
    }
  }

  @HostListener('document:keydown', ['$event'])
  protected onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.open) {
      return;
    }
    if (event.key === 'Escape' && this.closeOnEscape) {
      event.preventDefault();
      this.requestClose('escape');
      return;
    }
    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target !== event.currentTarget || !this.closeOnBackdrop) {
      return;
    }
    this.requestClose('backdrop');
  }

  protected requestClose(reason: UiModalCloseReason): void {
    this.closed.emit(reason);
    this.openChange.emit(false);
  }

  private captureFocus(): void {
    if (typeof document !== 'undefined') {
      this.previousFocus = document.activeElement as HTMLElement | null;
    }
  }

  private restoreFocus(): void {
    this.previousFocus?.focus();
    this.previousFocus = null;
  }

  private focusPanel(): void {
    queueMicrotask(() => {
      this.panel?.nativeElement.focus();
    });
  }

  private trapFocus(event: KeyboardEvent): void {
    const panel = this.panel?.nativeElement;
    if (!panel) {
      return;
    }
    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((element) => element.offsetParent !== null);
    if (focusables.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = typeof document !== 'undefined' ? document.activeElement : null;
    if (event.shiftKey && (active === first || active === panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
