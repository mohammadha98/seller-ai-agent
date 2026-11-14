import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  UiAlertComponent,
  UiButtonComponent,
  UiEmptyStateComponent,
  UiSpinnerComponent,
} from '@ai-shop/ui-kit';
import { Product } from '../../../core/types';
import { ProductStore } from '../../../core/state';
import { ProductCardComponent } from '../../../features/catalog/product-card/product-card';

@Component({
  selector: 'app-product-list-page',
  imports: [
    ProductCardComponent,
    UiAlertComponent,
    UiButtonComponent,
    UiEmptyStateComponent,
    UiSpinnerComponent,
  ],
  templateUrl: './product-list.page.html',
  styleUrl: './product-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPage implements OnInit {
  private readonly store = inject(ProductStore);
  private readonly router = inject(Router);

  protected readonly products = this.store.activeProducts;
  protected readonly loading = this.store.loading;
  protected readonly error = this.store.error;
  protected readonly activeEmpty = this.store.activeEmpty;

  ngOnInit(): void {
    this.load(false);
  }

  protected refresh(): void {
    this.load(true);
  }

  protected openProduct(product: Product): void {
    void this.router.navigate(['/products', product.id]);
  }

  private load(force: boolean): void {
    this.store.load(force).subscribe({ error: () => undefined });
  }
}
