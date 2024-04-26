import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { environment } from 'src/environments/environment';
import { Shop } from '../interfaces/shop';
import { Geolocation } from '@capacitor/geolocation';

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

  getDoenerladenID(): string {
    let user = this.getUser();
    return user.doenerladen;
  }

  logout() {
    localStorage.removeItem('user');
  }

  getFavorites(): Shop[] {
    return this.getUser().favoriten;
  }

  getFavoriteIds(): string[] {
    return this.getFavorites().map((shop) => shop.id);
  }

  toggleFavorite(shop: Shop) {
    if (this.getFavoriteIds().includes(shop.id)) {
      this.removeFavorite(shop.id);
    } else {
      this.addFavorite(shop);
    }
  }

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

  async getUserLocation(): Promise<{ lat: number; long: number }> {
    let loc = await Geolocation.getCurrentPosition();
    return { lat: loc.coords.latitude, long: loc.coords.longitude };
  }
}
