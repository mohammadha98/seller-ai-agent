import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ProductStore } from '../../../core/state';
import { ApiError, Product } from '../../../core/types';
import { ProductListPage } from './product-list.page';

const product: Product = {
  id: 'p1',
  name: 'Cotton Shirt',
  description: 'Regular fit, 100% cotton',
  price: 19.99,
  stock: 12,
  isActive: true,
};

const apiError: ApiError = {
  kind: 'server',
  status: 500,
  message: 'The catalog is temporarily unavailable.',
  validationErrors: [],
};

describe('ProductListPage', () => {
  let products: WritableSignal<Product[]>;
  let loading: WritableSignal<boolean>;
  let error: WritableSignal<ApiError | null>;
  let activeEmpty: WritableSignal<boolean>;
  let load: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    products = signal<Product[]>([]);
    loading = signal(false);
    error = signal<ApiError | null>(null);
    activeEmpty = signal(false);
    load = vi.fn(() => of(products()));

    await TestBed.configureTestingModule({
      imports: [ProductListPage],
      providers: [
        provideRouter([]),
        {
          provide: ProductStore,
          useValue: {
            activeProducts: products.asReadonly(),
            loading: loading.asReadonly(),
            error: error.asReadonly(),
            activeEmpty: activeEmpty.asReadonly(),
            load,
          },
        },
      ],
    }).compileComponents();
  });

  it('loads the catalog when the page is created', () => {
    const fixture = TestBed.createComponent(ProductListPage);
    fixture.detectChanges();

    expect(load).toHaveBeenCalledWith(false);
  });

  it('renders active product cards with a detail link', () => {
    products.set([product]);
    const fixture = TestBed.createComponent(ProductListPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Cotton Shirt');
    expect(compiled.textContent).toContain('$19.99');
    expect(compiled.querySelector('.catalog__grid a')?.getAttribute('href')).toBe('/products/p1');
  });

  it('shows a loading indicator while the first request is in flight', () => {
    loading.set(true);
    const fixture = TestBed.createComponent(ProductListPage);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('ui-spinner')).not.toBeNull();
  });

  it('shows an empty state when there are no active products', () => {
    activeEmpty.set(true);
    const fixture = TestBed.createComponent(ProductListPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('ui-empty-state')).not.toBeNull();
    expect(compiled.textContent).toContain('No products available');
  });

  it('shows the error message and retries with a forced reload', () => {
    error.set(apiError);
    const fixture = TestBed.createComponent(ProductListPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('ui-alert')?.textContent).toContain(apiError.message);

    const retry = compiled.querySelector('ui-alert ui-button button') as HTMLButtonElement;
    retry.click();

    expect(load).toHaveBeenCalledWith(true);
  });
});
