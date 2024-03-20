import { Routes } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';

export const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'shop/:id',
        loadComponent: () => import('./shop/shop.page').then((m) => m.ShopPage),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./signup/signup.page').then((m) => m.SignupPage),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./favorites/favorites.page').then((m) => m.FavoritesPage),
      },
    ],
  },
];
