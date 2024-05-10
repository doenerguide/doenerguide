import { Injectable } from '@angular/core';
import { Shop, ShopFunctions } from '../interfaces/shop';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  shopCache: Shop[] = [];
  constructor() {}

  /**
   * Add a stamp to the user's stamp card.
   * @param identification_code Identification code of the user.
   * @param shopId Shop where the stamp is added.
   * @returns The response of the server.
   */
  async addUserStamp(identification_code: string, shopId: string): Promise<any> {
    let response = await fetch(`${environment.endpoint}/addUserStamp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identification_code: identification_code, shop_id: shopId }),
    }).then((response) => response.json());
    return response;
  }

  /**
   * Get the number of stamps of a user.
   * @param identificationCode  Identification code of the user.
   * @param shopId Shop where the stamps are counted.
   * @returns The number of stamps of the user.
   */
  async getUserStamps(identificationCode: string, shopId: string): Promise<number> {
    let response = await fetch(`${environment.endpoint}/getUserStamps?identification_code=${identificationCode}&shop_id=${shopId}`);
    let stamps = await response.json();
    return stamps.amount as number;
  }

  /**
   * Get all stamps of a user.
   * @param identificationCode Identification code of the user.
   * @returns The stamps of the user.
   */
  async getAllUserStamps(identificationCode: string): Promise<{ [id: number]: number }> {
    let response = await fetch(`${environment.endpoint}/getUserStamps?identification_code=${identificationCode}`).then((resp) => resp.json());
    return response['stamps'];
  }

  /**
   * Remove all stamps of a user.
   * @param identificationCode Identification code of the user.
   * @param shopId Shop where the stamps are removed.
   * @returns The response of the server.
   */
  async removeUserStamps(identificationCode: string, shopId: string): Promise<any> {
    let response = await fetch(`${environment.endpoint}/removeUserStamps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identification_code: identificationCode, shop_id: shopId }),
    }).then((response) => response.json());
    return response;
  }

  /**
   * Update the user data
   * @param user The user object which should be updated.
   * @returns If the update was successful.
   */
  async updateUser(user: User): Promise<boolean> {
    let response = await fetch(`${environment.endpoint}/updateUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    return response.ok;
  }

  /**
   * Update the password of a user.
   * @param userId User ID of the user.
   * @param passwordOld Old password of the user.
   * @param passwordNew New password of the user.
   * @returns If the update was successful.
   */
  async updateUserPassword(userId: number, passwordOld: string, passwordNew: string): Promise<boolean> {
    let response = await fetch(`${environment.endpoint}/updateUserPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userId, passwordOld: passwordOld, passwordNew: passwordNew }),
    });
    return response.ok;
  }

  /**
   * Get the shop object by the ID.
   * @param id ID of the shop.
   * @returns Shop object.
   */
  async getShop(id: string): Promise<Shop> {
    if (this.shopCache.length > 0 && this.shopCache.find((shop) => shop.id === id) !== undefined) {
      return this.shopCache.find((shop) => shop.id === id) as Shop;
    }
    let response = await fetch(`${environment.endpoint}/getShop?id=${id}`);
    let shop = this.doenerladen_tuple_to_map(await response.json());
    this.shopCache.push(shop);
    return shop;
  }

  /**
   * Get the shops based on the latitude, longitude and radius.
   * @param lat Latitude
   * @param long Longitude
   * @param radius Radius
   * @returns List of shops.
   */
  async getShops(lat: number, long: number, radius: number): Promise<Shop[]> {
    let response = await fetch(`${environment.endpoint}/getShops?lat=${lat}&long=${long}&radius=${radius}&price_category=0&flags=[]`);
    let data = await response.json();
    let shops = data.map((shop: any) => this.doenerladen_tuple_to_map(shop, lat, long)) as Shop[];
    this.shopCache.concat(shops);
    let set = new Set(this.shopCache);
    this.shopCache = Array.from(set);
    return shops;
  }

  /**
   * Calculates degrees to radians.
   * @param deg Degrees.
   * @returns Radians.
   */
  deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  /**
   * Calculates the distance between two sets of latitude and longitude coordinates.
   * @param lat1 - The latitude of the first coordinate.
   * @param lon1 - The longitude of the first coordinate.
   * @param lat2 - The latitude of the second coordinate.
   * @param lon2 - The longitude of the second coordinate.
   * @param digits - The number of decimal places to round the distance to (default: 2).
   * @returns The distance between the two coordinates in kilometers, rounded to the specified number of decimal places.
   */
  lat_long_to_distance(lat1: number, lon1: number, lat2: number, lon2: number, digits: number = 2) {
    let R = 6373.0;
    lat1 = this.deg2rad(lat1);
    lon1 = this.deg2rad(lon1);
    lat2 = this.deg2rad(lat2);
    lon2 = this.deg2rad(lon2);

    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;

    let a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let distance = R * c;
    return Number(distance.toFixed(digits));
  }

  /**
   * Converts a doenerladen tuple to a map object.
   * @param doenerladen - The doenerladen tuple.
   * @param lat - The latitude.
   * @param long - The longitude.
   * @returns The map object representing the doenerladen.
   */
  doenerladen_tuple_to_map(doenerladen: any, lat?: number, long?: number): Shop {
    let d_lat = doenerladen[9];
    let d_long = doenerladen[10];
    let address = doenerladen[3];
    let distance = -1;
    if (lat && long) {
      distance = this.lat_long_to_distance(lat, long, d_lat, d_long, 1);
      address = address + ' (' + distance.toString() + 'km)';
    }
    let weekday = new Date().toLocaleString('de-DE', { weekday: 'long' });
    let hours = JSON.parse(doenerladen[7].replace(/'/g, '"')) as {
      [weekday: string]: { open: string; close: string }[];
    };
    let orderedHours = Object.keys(hours)
      .sort((a, b) => {
        let days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
        return days.indexOf(a) - days.indexOf(b);
      })
      .reduce((obj: any, key) => {
        obj[key] = hours[key];
        return obj;
      }, {});
    let hoursToday = hours[weekday];
    if (distance >= 0)
      return {
        id: doenerladen[0],
        name: doenerladen[1],
        imageUrl: doenerladen[2],
        address: address,
        distance: distance,
        rating: doenerladen[4],
        priceCategory: doenerladen[5],
        flags: {
          acceptCreditCard: doenerladen[6].includes('Kreditkarte'),
          acceptDebitCard: doenerladen[6].includes('Debitkarte'),
          stampCard: doenerladen[6].includes('Stempelkarte'),
          open: ShopFunctions.checkOpeningColor(hoursToday).open,
          halal: doenerladen[6].includes('Halal'),
          vegetarian: doenerladen[6].includes('Vegetarisch'),
          vegan: doenerladen[6].includes('Vegan'),
          barrierFree: doenerladen[6].includes('Barrierefrei') || doenerladen[6].includes('Rollstuhl'),
          delivery: doenerladen[6].includes('Lieferung'),
          pickup: doenerladen[6].includes('Abholung') || doenerladen[6].includes('Mitnehmen') || doenerladen[6].includes('vor Ort'),
        },
        openToday: hoursToday,
        openingHours: orderedHours,
        tel: doenerladen[8],
        lat: doenerladen[9],
        lng: doenerladen[10],
        mapsUrl: doenerladen[12],
      };
    else
      return {
        id: doenerladen[0],
        name: doenerladen[1],
        imageUrl: doenerladen[2],
        address: address,
        rating: doenerladen[4],
        priceCategory: doenerladen[5],
        flags: {
          acceptCreditCard: doenerladen[6].includes('Kreditkarte'),
          acceptDebitCard: doenerladen[6].includes('Debitkarte'),
          stampCard: doenerladen[6].includes('Stempelkarte'),
          open: ShopFunctions.checkOpeningColor(hoursToday).open,
          halal: doenerladen[6].includes('Halal'),
          vegetarian: doenerladen[6].includes('Vegetarisch'),
          vegan: doenerladen[6].includes('Vegan'),
          barrierFree: doenerladen[6].includes('Barrierefrei') || doenerladen[6].includes('Rollstuhl'),
          delivery: doenerladen[6].includes('Lieferung'),
          pickup: doenerladen[6].includes('Abholung') || doenerladen[6].includes('Mitnehmen') || doenerladen[6].includes('vor Ort'),
        },
        openToday: hoursToday,
        openingHours: orderedHours,
        tel: doenerladen[8],
        lat: doenerladen[9],
        lng: doenerladen[10],
        mapsUrl: doenerladen[12],
      };
  }
}
