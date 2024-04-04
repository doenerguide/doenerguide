import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NavigationComponent } from '../navigation/navigation.component';
import { Shop, ShopFunctions } from '../interfaces/shop';
import { RatingComponent } from '../rating/rating.component';
import { CommonModule } from '@angular/common';
import { PriceComponent } from '../price/price.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular/standalone';
import { DatabaseService } from '../services/database.service';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastCtrl: ToastController,
    private router: Router,
    private databaseSrv: DatabaseService
  ) {}

  shopFunctions = ShopFunctions;

  ngOnInit() {
    this.shownShops = environment.shops;
  }

  pinFormatter(value: number) {
    return `${value}km`;
  }

  async setShops() {
    this.shownShops = await this.databaseSrv.getShops(
      this.lat,
      this.long,
      this.radius
    );
  }

  async change_radius(event: any) {
    this.radius = event.detail.value;
    this.setShops();
  }

  getUserLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
        this.setShops();
      },
      (error) => {
        console.error('Error getting user location:', error);
        this.setShops();
      }
    );
  }

  ionViewWillEnter() {
    this.getUserLocation();
    if (this.activatedRoute.snapshot.paramMap.get('message')) {
      this.toastCtrl
        .create({
          message: this.activatedRoute.snapshot.paramMap.get('message')!,
          duration: 2000,
          color: 'success',
          icon: 'checkmark-circle-outline',
          position: 'top',
        })
        .then((toast) => {
          toast.present();
          this.router.navigate(['.'], {
            queryParams: { message: null },
            queryParamsHandling: 'merge',
          });
        });
    }
  }
}
