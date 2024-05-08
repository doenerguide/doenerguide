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
        path: 'login',
        loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'signup',
        loadComponent: () => import('./signup/signup.page').then((m) => m.SignupPage),
      },
      {
        path: 'favorites',
        loadComponent: () => import('./favorites/favorites.page').then((m) => m.FavoritesPage),
      },
      {
        path: 'map',
        loadComponent: () => import('./map/map.page').then((m) => m.MapPage),
      },
      {
        path: 'account',
        loadComponent: () => import('./account/account.page').then((m) => m.AccountPage),
      },
      {
        path: 'doeneraccount',
        loadComponent: () => import('./doeneraccount/doeneraccount.page').then((m) => m.DoeneraccountPage),
      },
    ],
  },
  {
    path: 'shop',
    loadComponent: () => import('./shop/shop.page').then((m) => m.ShopPage),
  },
  {
    path: 'stempelkarten',
    loadComponent: () => import('./stempelkarten/stempelkarten.page').then((m) => m.StempelkartenPage),
  },
];
