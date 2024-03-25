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

function lat_long_to_distance(lat1: number, lon1: number, lat2: number, lon2: number, digits: number = 2) {
  var R = 6373.0;
  var lat1 = deg2rad(lat1);
  var lon1 = deg2rad(lon1);
  var lat2 = deg2rad(lat2);
  var lon2 = deg2rad(lon2);

  var dlon = lon2 - lon1;
  var dlat = lat2 - lat1;

  var a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  var distance = R * c;
  return distance.toFixed(digits);
}

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
