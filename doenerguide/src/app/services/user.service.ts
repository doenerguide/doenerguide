import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { environment } from 'src/environments/environment';
import { Shop } from '../interfaces/shop';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private endpoint = environment.endpoint;

  constructor(private storageSrv: StorageService) {}

  /**
   * Set the user
   * @param user User object
   */
  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Get the user
   * @returns User object if logged in, empty object otherwise
   */
  getUser(): User {
    return JSON.parse(localStorage.getItem('user') ?? '{}');
  }

  /**
   * Check if the user is logged in
   * @returns True if the user is logged in, false otherwise
   */
  isLoggedIn() {
    return localStorage.getItem('user') !== null;
  }

  /**
   * Log the user out
   */
  logout() {
    localStorage.removeItem('user');
    this.storageSrv.removeSessionToken();
  }

  /**
   * Get the favorites of the user
   * @returns List of favorite shops
   */
  getFavorites(): Shop[] {
    return this.getUser().favoriten;
  }

  /**
   * Get the favorite ids of the user
   * @returns List of favorite shop ids
   */
  getFavoriteIds(): string[] {
    return this.getFavorites().map((shop) => shop.id);
  }

  /**
   * Toggle the favorite status of a shop
   * @param shop Object of the shop
   */
  toggleFavorite(shop: Shop) {
    if (this.getFavoriteIds().includes(shop.id)) {
      this.removeFavorite(shop.id);
    } else {
      this.addFavorite(shop);
    }
  }

  /**
   * Add a shop to the favorites
   * @param shop Shop object
   */
  addFavorite(shop: Shop) {
    let user = this.getUser();
    user.favoriten.push(shop);
    this.setUser(user);
    fetch(this.endpoint + '/updateFavoriten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        user_id: user.id,
        favoriten: user.favoriten.map((shop) => shop.id),
      }),
    });
  }

  /**
   * Remove a shop from the favorites
   * @param shopId Id of the shop
   */
  removeFavorite(shopId: string) {
    let user = this.getUser();
    user.favoriten = user.favoriten.filter((shop) => shop.id !== shopId);
    this.setUser(user);
    fetch(this.endpoint + '/updateFavoriten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        user_id: user.id,
        favoriten: user.favoriten.map((shop) => shop.id),
      }),
    });
  }
}
