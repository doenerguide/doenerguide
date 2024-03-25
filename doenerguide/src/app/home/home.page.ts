import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NavigationComponent } from '../navigation/navigation.component';
import { Shop } from '../interfaces/shop';
import { RatingComponent } from '../rating/rating.component';
import { CommonModule } from '@angular/common';
import { PriceComponent } from '../price/price.component';
import { RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ShopFunctions } from '../interfaces/shop';

function deg2rad(deg: number) {
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
function lat_long_to_distance(lat1: number, lon1: number, lat2: number, lon2: number, digits: number = 2) {
  let R = 6373.0;
  lat1 = deg2rad(lat1);
  lon1 = deg2rad(lon1);
  lat2 = deg2rad(lat2);
  lon2 = deg2rad(lon2);

  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;

  let a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
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
function doenerladen_tuple_to_map(doenerladen: any, lat: number, long: number) {
  var d_lat = doenerladen[9] / 1000000;
  var d_long = doenerladen[10] / 1000000;
  var address = doenerladen[3] + " (" + lat_long_to_distance(lat, long, d_lat, d_long, 1) + "km)";
  return {
    id: doenerladen[0],
    name: doenerladen[1],
    imageUrl: doenerladen[2],
    address: address,
    rating: doenerladen[4],
    priceCategory: doenerladen[5],
    flags: {
      acceptCard: doenerladen[6].includes("Kartenzahlung"),
      stampCard: doenerladen[6].includes("Stempelkarte"),
    },
    openingHours: {
      opens: doenerladen[7].split("-")[0],
      closes: doenerladen[7].split("-")[1],
    },
    tel: doenerladen[8],
    lat: doenerladen[9],
    lng: doenerladen[10],
  }
}

/**
 * Fetches doenerlaeden (kebab shops) based on the provided latitude, longitude, and radius.
 * @param lat - The latitude of the location.
 * @param long - The longitude of the location.
 * @param radius - The search radius in meters.
 * @returns A Promise that resolves to an array of Shop objects.
 */
async function fetch_doenerlaeden(lat: number, long: number, radius: number): Promise<Shop[]> {
  const response = await fetch(`http://localhost:5050/getShops?lat=${lat}&long=${long}&radius=${radius}&price_category=0&flags=[]`);
  const data = await response.json();
  return data.map((doenerladen: any) => doenerladen_tuple_to_map(doenerladen, lat, long));
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NavigationComponent,
    RatingComponent,
    CommonModule,
    PriceComponent,
    RouterModule,
  ],
})

/**
 * Represents the home page of the application.
 */
export class HomePage implements OnInit {
  shownShops: Shop[] = [];

  shopFunctions = ShopFunctions;

  ngOnInit() {
    this.shownShops = environment.shops;
  }

  getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let long = position.coords.longitude;
      fetch_doenerlaeden(lat, long, 10000000).then((shops: Shop[]) => {
        this.shownShops = shops;
      });
    }, (error) => {
      console.error('Error getting user location:', error);
      fetch_doenerlaeden(0, 0, 10000000).then((shops: Shop[]) => {
        this.shownShops = shops;
      });
    });
  }


  ionViewWillEnter() {
    this.getUserLocation();
  }
}
