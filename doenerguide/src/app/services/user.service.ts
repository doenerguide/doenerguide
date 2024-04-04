import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { environment } from 'src/environments/environment';
import { Shop } from '../interfaces/shop';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private endpoint = environment.endpoint;

  constructor() {}

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem('user') ?? '{}');
  }

  isLoggedIn() {
    return localStorage.getItem('user') !== null;
  }

  logout() {
    localStorage.removeItem('user');
  }

  addFavorite(shop: Shop) {
    let user = this.getUser();
    user.favorites.push(shop);
    this.setUser(user);
    fetch(this.endpoint + '/updateFavoriten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        user_id: user.id,
        favoriten: user.favorites.map((shop) => shop.id),
      }),
    });
  }

  removeFavorite(shopId: string) {
    let user = this.getUser();
    user.favorites = user.favorites.filter((shop) => shop.id !== shopId);
    this.setUser(user);
    fetch(this.endpoint + '/updateFavoriten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        user_id: user.id,
        favoriten: user.favorites.map((shop) => shop.id),
      }),
    });
  }
}
