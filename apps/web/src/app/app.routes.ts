import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'AI Shop Salesman',
    pathMatch: 'full',
    loadComponent: () => import('../pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '**',
    title: 'Page not found | AI Shop Salesman',
    loadComponent: () => import('../pages/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
];
