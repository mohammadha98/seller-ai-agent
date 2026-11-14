import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'AI Shop Salesman',
    pathMatch: 'full',
    loadComponent: () => import('../pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'products',
    title: 'Products | AI Shop Salesman',
    loadComponent: () =>
      import('../pages/products/product-list/product-list.page').then((m) => m.ProductListPage),
  },
  {
    path: 'products/:id',
    title: 'Product details | AI Shop Salesman',
    loadComponent: () =>
      import('../pages/products/product-detail/product-detail.page').then(
        (m) => m.ProductDetailPage,
      ),
  },
  {
    path: '**',
    title: 'Page not found | AI Shop Salesman',
    loadComponent: () => import('../pages/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
];
