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
  lat: number = 52.520008;
  long: number = 13.404954;
  radius: number = 5;

  shopFunctions = ShopFunctions;

  ngOnInit() {
    this.shownShops = environment.shops;
  }

  pinFormatter(value: number) {
    return `${value}km`;
  }

  change_radius(event: any) {
    this.radius = event.detail.value;
    this.set_shops();
  }

  set_shops() {
    fetch(`http://localhost:5050/getShops?lat=${this.lat}&long=${this.long}&radius=${this.radius}&price_category=0&flags=[]`).then((response) => {
      response.json().then((data) => {
        let shops = data.map((shop: any) => doenerladen_tuple_to_map(shop, this.lat, this.long));
        this.shownShops = shops;
      });
    });
  }

  getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;
      this.set_shops();
    }, (error) => {
      console.error('Error getting user location:', error);
      this.set_shops();
    });
  }


  ionViewWillEnter() {
    this.getUserLocation();
  }
}

