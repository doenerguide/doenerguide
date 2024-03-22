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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('Latitude: ' + position.coords.latitude);
        console.log('Longitude: ' + position.coords.longitude);
        fetch(`http://localhost:5050/getShops?lat=${position.coords.latitude}&long=${position.coords.longitude}&radius=100000&price_category=0&flags=[]`)
          .then(response => response.json())
          .then(data => {
            // Handle the response data here
            console.log(data);
          })
          .catch(error => {
            console.error('Error:', error);
          });

      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  ionViewWillEnter() {
    this.getUserLocation();
  }
}


