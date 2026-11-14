import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Product } from '../../../core/types';
import { ProductCardComponent } from './product-card';

const product: Product = {
  id: 'p1',
  name: 'Cotton Shirt',
  description: 'Regular fit, 100% cotton',
  price: 19.99,
  stock: 12,
  isActive: true,
};

describe('ProductCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the product and a link to its detail page', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Cotton Shirt');
    expect(compiled.textContent).toContain('$19.99');
    expect(compiled.textContent).toContain('In stock');
    expect(compiled.querySelector('a')?.getAttribute('href')).toBe('/products/p1');
  });

  it('warns when stock is low', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', { ...product, stock: 3 });
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Only 3 left');
  });

  it('emits the product when the view action is used', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();

    let emitted: Product | undefined;
    fixture.componentInstance.view.subscribe((value) => (emitted = value));

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'ui-button button',
    ) as HTMLButtonElement;
    button.click();

    expect(emitted).toEqual(product);
  });
});
