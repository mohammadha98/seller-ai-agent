import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';

export type UiTabsVariant = 'line' | 'pill';
export type UiTabsSize = 'sm' | 'md';

export interface UiTab {
  id: string;
  label: string;
  disabled?: boolean;
  badge?: string | number | null;
}

@Component({
  selector: 'ui-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTabsComponent {
  @Input() tabs: readonly UiTab[] = [];
  @Input() activeId: string | null = null;
  @Input() variant: UiTabsVariant = 'line';
  @Input() size: UiTabsSize = 'md';
  @Input() ariaLabel = 'Tabs';

  @Output() readonly activeIdChange = new EventEmitter<string>();

  @ViewChildren('tabButton')
  private tabButtons?: QueryList<ElementRef<HTMLButtonElement>>;

  protected select(tab: UiTab): void {
    if (tab.disabled) {
      return;
    }
    this.activate(tab);
  }

  protected tabIndexFor(tab: UiTab, index: number): number {
    if (tab.id === this.activeId) {
      return 0;
    }
    const hasActive = this.tabs.some((candidate) => candidate.id === this.activeId);
    if (!hasActive) {
      const firstEnabled = this.tabs.findIndex((candidate) => !candidate.disabled);
      return index === firstEnabled ? 0 : -1;
    }
    return -1;
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const total = this.tabs.length;
    if (total === 0) {
      return;
    }

    let next = -1;
    if (event.key === 'ArrowRight') {
      next = this.findEnabled(index + 1, 1);
    } else if (event.key === 'ArrowLeft') {
      next = this.findEnabled(index - 1, -1);
    } else if (event.key === 'Home') {
      next = this.tabs.findIndex((tab) => !tab.disabled);
    } else if (event.key === 'End') {
      next = this.findEnabled(total - 1, -1);
    }

    if (next < 0) {
      return;
    }

    event.preventDefault();
    this.activate(this.tabs[next]);
    queueMicrotask(() => this.tabButtons?.get(next)?.nativeElement.focus());
  }

  private activate(tab: UiTab): void {
    this.activeId = tab.id;
    this.activeIdChange.emit(tab.id);
  }

  private findEnabled(start: number, direction: 1 | -1): number {
    const total = this.tabs.length;
    let index = (start + total) % total;
    for (let visited = 0; visited < total; visited += 1) {
      if (!this.tabs[index].disabled) {
        return index;
      }
      index = (index + direction + total) % total;
    }
    return -1;
  }
}
