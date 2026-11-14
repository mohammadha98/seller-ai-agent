import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  UiAlertComponent,
  UiBadgeComponent,
  UiButtonComponent,
  UiCardComponent,
  UiEmptyStateComponent,
  UiSpinnerComponent,
} from '@ai-shop/ui-kit';
import type { UiBadgeVariant } from '@ai-shop/ui-kit';
import { ProductStore } from '../../../core/state';
import { ApiError, Product } from '../../../core/types';
import { ProductService } from '../../../services';

interface StockBadge {
  readonly label: string;
  readonly variant: UiBadgeVariant;
}

@Component({
  selector: 'app-product-detail-page',
  imports: [
    CurrencyPipe,
    RouterLink,
    UiAlertComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent,
    UiEmptyStateComponent,
    UiSpinnerComponent,
  ],
  templateUrl: './product-detail.page.html',
  styleUrl: './product-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly store = inject(ProductStore);
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly product = signal<Product | null>(null);
  protected readonly loading = signal(true);
  protected readonly notFound = signal(false);
  protected readonly error = signal<ApiError | null>(null);

  protected readonly stockBadge = computed<StockBadge>(() => {
    const product = this.product();
    if (!product || product.stock === 0) {
      return { label: 'Out of stock', variant: 'danger' };
    }
    if (product.stock <= 5) {
      return { label: `Only ${product.stock} left`, variant: 'warning' };
    }
    return { label: 'In stock', variant: 'success' };
  });

  private productId = '';

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = params.get('id') ?? '';
      this.productId = id;
      this.load(id);
    });
  }

  protected reload(): void {
    if (this.productId) {
      this.load(this.productId);
    }
  }

  protected backToProducts(): void {
    void this.router.navigate(['/products']);
  }

  private load(id: string): void {
    if (!id) {
      this.showNotFound();
      return;
    }

    const cached = this.store.productById(id);
    if (cached) {
      this.applyProduct(cached);
      return;
    }

    this.loading.set(true);
    this.notFound.set(false);
    this.error.set(null);
    this.product.set(null);

    this.productService
      .getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => this.applyProduct(product),
        error: (error: ApiError) => {
          this.loading.set(false);
          if (error.kind === 'not-found') {
            this.showNotFound();
            return;
          }
          this.error.set(error);
        },
      });
  }

  private applyProduct(product: Product): void {
    if (!product.isActive) {
      this.showNotFound();
      return;
    }

    this.product.set(product);
    this.loading.set(false);
    this.notFound.set(false);
    this.error.set(null);
    this.title.setTitle(`${product.name} | AI Shop Salesman`);
  }

  private showNotFound(): void {
    this.product.set(null);
    this.loading.set(false);
    this.notFound.set(true);
    this.error.set(null);
    this.title.setTitle('Product not found | AI Shop Salesman');
  }
}
