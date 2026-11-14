import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, of, tap, throwError } from 'rxjs';
import {
  ApiError,
  CreateProductDto,
  Product,
  UpdateProductDto,
} from '../types';
import { ProductService } from '../../services/product.service';

@Injectable({ providedIn: 'root' })
export class ProductStore {
  private readonly productService = inject(ProductService);

  private readonly productState = signal<readonly Product[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<ApiError | null>(null);
  private readonly loadedState = signal(false);

  readonly products = this.productState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly loaded = this.loadedState.asReadonly();

  readonly activeProducts = computed(() =>
    this.productState().filter((product) => product.isActive),
  );
  readonly productCount = computed(() => this.productState().length);
  readonly activeProductCount = computed(() => this.activeProducts().length);
  readonly hasProducts = computed(() => this.productState().length > 0);
  readonly hasActiveProducts = computed(() => this.activeProducts().length > 0);
  readonly isEmpty = computed(
    () => this.loadedState() && !this.loadingState() && !this.hasProducts(),
  );
  readonly activeEmpty = computed(
    () => this.loadedState() && !this.loadingState() && !this.hasActiveProducts(),
  );

  productById(id: string): Product | null {
    return this.productState().find((product) => product.id === id) ?? null;
  }

  activeProductById(id: string): Product | null {
    const product = this.productById(id);
    return product?.isActive ? product : null;
  }

  load(force = false): Observable<readonly Product[]> {
    if (this.loadedState() && !force) {
      return of(this.productState());
    }

    return this.runRequest(this.productService.list(), (products) => {
      this.productState.set(products);
      this.loadedState.set(true);
    });
  }

  create(dto: CreateProductDto): Observable<Product> {
    return this.runRequest(this.productService.create(dto), (created) => {
      this.productState.update((products) => [...products, created]);
    });
  }

  update(id: string, dto: UpdateProductDto): Observable<Product> {
    return this.runRequest(this.productService.update(id, dto), (updated) => {
      this.productState.update((products) =>
        products.map((product) =>
          product.id === updated.id ? updated : product,
        ),
      );
    });
  }

  remove(id: string): Observable<void> {
    return this.runRequest(this.productService.remove(id), () => {
      this.productState.update((products) =>
        products.filter((product) => product.id !== id),
      );
    });
  }

  reset(): void {
    this.productState.set([]);
    this.loadedState.set(false);
    this.errorState.set(null);
  }

  private runRequest<T>(
    request: Observable<T>,
    onSuccess: (value: T) => void,
  ): Observable<T> {
    this.loadingState.set(true);
    this.errorState.set(null);

    return request.pipe(
      tap(onSuccess),
      catchError((error: unknown) => {
        this.errorState.set(error as ApiError);
        return throwError(() => error);
      }),
      finalize(() => this.loadingState.set(false)),
    );
  }
}
