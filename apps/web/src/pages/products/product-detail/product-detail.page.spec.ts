import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductStore } from '../../../core/state';
import { ApiError, Product } from '../../../core/types';
import { ProductService } from '../../../services';
import { ProductDetailPage } from './product-detail.page';

const product: Product = {
  id: 'p1',
  name: 'Cotton Shirt',
  description: 'Regular fit, 100% cotton',
  price: 19.99,
  stock: 12,
  isActive: true,
};

const notFoundError: ApiError = {
  kind: 'not-found',
  status: 404,
  message: 'Product not found.',
  validationErrors: [],
};

const serverError: ApiError = {
  kind: 'server',
  status: 500,
  message: 'The catalog is temporarily unavailable.',
  validationErrors: [],
};

describe('ProductDetailPage', () => {
  let productById: ReturnType<typeof vi.fn>;
  let getById: ReturnType<typeof vi.fn>;
  let setTitle: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    productById = vi.fn(() => null);
    getById = vi.fn();
    setTitle = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ProductDetailPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: 'p1' })) },
        },
        { provide: ProductStore, useValue: { productById } },
        { provide: ProductService, useValue: { getById } },
        { provide: Title, useValue: { setTitle } },
      ],
    }).compileComponents();
  });

  it('loads and renders the product for the route id', () => {
    getById.mockReturnValue(of(product));

    const fixture = TestBed.createComponent(ProductDetailPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(getById).toHaveBeenCalledWith('p1');
    expect(compiled.textContent).toContain('Cotton Shirt');
    expect(compiled.textContent).toContain('Regular fit, 100% cotton');
    expect(compiled.textContent).toContain('$19.99');
    expect(compiled.textContent).toContain('In stock');
    expect(setTitle).toHaveBeenCalledWith('Cotton Shirt | AI Shop Salesman');
  });

  it('uses a cached product without calling the service', () => {
    productById.mockReturnValue(product);

    const fixture = TestBed.createComponent(ProductDetailPage);
    fixture.detectChanges();

    expect(getById).not.toHaveBeenCalled();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Cotton Shirt');
  });

  it('shows a not-found state for an inactive product', () => {
    getById.mockReturnValue(of({ ...product, isActive: false }));

    const fixture = TestBed.createComponent(ProductDetailPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Product not found');
    expect(compiled.querySelector('ui-empty-state')).not.toBeNull();
    expect(compiled.textContent).not.toContain('Regular fit, 100% cotton');
  });

  it('shows a not-found state when the service reports a missing product', () => {
    getById.mockReturnValue(throwError(() => notFoundError));

    const fixture = TestBed.createComponent(ProductDetailPage);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain(
      'Product not found',
    );
  });

  it('shows an error and retries when the request fails', () => {
    getById.mockReturnValue(throwError(() => serverError));

    const fixture = TestBed.createComponent(ProductDetailPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('ui-alert')?.textContent).toContain(serverError.message);

    const retry = compiled.querySelector('ui-alert ui-button button') as HTMLButtonElement;
    retry.click();

    expect(getById).toHaveBeenCalledTimes(2);
  });
});
