import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  numberAttribute,
  Output,
} from '@angular/core';

export type UiPaginationSize = 'sm' | 'md';

export interface UiPaginationItem {
  key: string;
  label: string;
  page: number | null;
}

@Component({
  selector: 'ui-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiPaginationComponent {
  @Input({ transform: numberAttribute }) page = 1;
  @Input({ transform: numberAttribute }) pageCount = 1;
  @Input({ transform: numberAttribute }) siblingCount = 1;
  @Input() size: UiPaginationSize = 'md';
  @Input() ariaLabel = 'Pagination';
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() readonly pageChange = new EventEmitter<number>();

  protected get normalizedPageCount(): number {
    return Math.max(1, Math.floor(this.pageCount));
  }

  protected get currentPage(): number {
    return Math.min(Math.max(1, Math.floor(this.page)), this.normalizedPageCount);
  }

  protected get items(): UiPaginationItem[] {
    const total = this.normalizedPageCount;
    const current = this.currentPage;
    const siblings = Math.max(0, Math.floor(this.siblingCount));
    const items: UiPaginationItem[] = [];

    const pushPage = (page: number): void => {
      items.push({ key: `page-${page}`, label: String(page), page });
    };
    const pushEllipsis = (side: string): void => {
      items.push({ key: `ellipsis-${side}`, label: '…', page: null });
    };

    if (total <= 7) {
      for (let page = 1; page <= total; page += 1) {
        pushPage(page);
      }
      return items;
    }

    const windowSize = siblings * 2 + 1;
    let start = Math.max(2, current - siblings);
    let end = Math.min(total - 1, current + siblings);

    if (current <= siblings + 2) {
      start = 2;
      end = Math.min(total - 1, windowSize + 2);
    } else if (current >= total - siblings - 1) {
      end = total - 1;
      start = Math.max(2, total - 1 - (windowSize + 1));
    }

    pushPage(1);
    if (start > 2) {
      pushEllipsis('start');
    }
    for (let page = start; page <= end; page += 1) {
      pushPage(page);
    }
    if (end < total - 1) {
      pushEllipsis('end');
    }
    pushPage(total);

    return items;
  }

  protected goTo(page: number): void {
    if (this.disabled) {
      return;
    }
    const target = Math.min(Math.max(1, Math.floor(page)), this.normalizedPageCount);
    if (target === this.currentPage) {
      return;
    }
    this.page = target;
    this.pageChange.emit(target);
  }
}
