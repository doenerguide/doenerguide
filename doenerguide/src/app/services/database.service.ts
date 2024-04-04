import { Injectable } from '@angular/core';
import { Shop } from '../interfaces/shop';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  shopCache: Shop[] = [];
  constructor() {}

  async getShop(id: string): Promise<Shop> {
    if (
      this.shopCache.length > 0 &&
      this.shopCache.find((shop) => shop.id === id) !== undefined
    ) {
      return this.shopCache.find((shop) => shop.id === id) as Shop;
    }
    let response = await fetch(`http://localhost:5050/getShop?id=${id}`);
    let data = (await response.json()) as Shop;
    return data;
  }

  async getShops(lat: number, long: number, radius: number): Promise<Shop[]> {
    let response = await fetch(
      `http://localhost:5050/getShops?lat=${lat}&long=${long}&radius=${radius}&price_category=0&flags=[]`
    );
    /*.then((response) => {
      response.json().then((data) => {
        let shops = data.map((shop: any) =>
          doenerladen_tuple_to_map(shop, this.lat, this.long)
        );
        this.shownShops = shops;
      });
    });*/
    let data = (await response.json()) as Shop[];
    let shops = data.map((shop: any) =>
      this.doenerladen_tuple_to_map(shop, lat, long)
    );
    this.shopCache.concat(shops);
    let set = new Set(this.shopCache);
    this.shopCache = Array.from(set);
    return shops;
  }

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
  lat_long_to_distance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    digits: number = 2
  ) {
    let R = 6373.0;
    lat1 = this.deg2rad(lat1);
    lon1 = this.deg2rad(lon1);
    lat2 = this.deg2rad(lat2);
    lon2 = this.deg2rad(lon2);

    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;

    let a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var distance = R * c;
    return distance.toFixed(digits);
  }

  /**
   * Converts a doenerladen tuple to a map object.
   * @param doenerladen - The doenerladen tuple.
   * @param lat - The latitude.
   * @param long - The longitude.
   * @returns The map object representing the doenerladen.
   */
  doenerladen_tuple_to_map(doenerladen: any, lat: number, long: number) {
    var d_lat = doenerladen[9] / 1000000;
    var d_long = doenerladen[10] / 1000000;
    var address =
      doenerladen[3] +
      ' (' +
      this.lat_long_to_distance(lat, long, d_lat, d_long, 1) +
      'km)';
    return {
      id: doenerladen[0],
      name: doenerladen[1],
      imageUrl: doenerladen[2],
      address: address,
      rating: doenerladen[4],
      priceCategory: doenerladen[5],
      flags: {
        acceptCard: doenerladen[6].includes('Kartenzahlung'),
        stampCard: doenerladen[6].includes('Stempelkarte'),
      },
      openingHours: {
        opens: doenerladen[7].split('-')[0],
        closes: doenerladen[7].split('-')[1],
      },
      tel: doenerladen[8],
      lat: doenerladen[9],
      lng: doenerladen[10],
    };
  }
}
