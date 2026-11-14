import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFoundPage } from './not-found.page';

describe('NotFoundPage', () => {
  it('offers a link back to the home page', async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundPage],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(NotFoundPage);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain("couldn't find that page");
    expect(compiled.querySelector('.not-found__link')?.getAttribute('href')).toBe('/');
  });
});
