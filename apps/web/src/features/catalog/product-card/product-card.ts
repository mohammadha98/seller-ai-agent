import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiBadgeComponent, UiButtonComponent, UiCardComponent } from '@ai-shop/ui-kit';
import type { UiBadgeVariant } from '@ai-shop/ui-kit';
import { Product } from '../../../core/types';

interface StockBadge {
  readonly label: string;
  readonly variant: UiBadgeVariant;
}

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink, UiBadgeComponent, UiButtonComponent, UiCardComponent],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly view = output<Product>();

  protected readonly stockBadge = computed<StockBadge>(() => {
    const stock = this.product().stock;
    if (stock === 0) {
      return { label: 'Out of stock', variant: 'danger' };
    }
    if (stock <= 5) {
      return { label: `Only ${stock} left`, variant: 'warning' };
    }
    return { label: 'In stock', variant: 'success' };
  });
}
