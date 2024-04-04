import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { UserService } from '../services/user.service';

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
    private databaseSrv: DatabaseService,
    public userSrv: UserService,
    private changeDetector: ChangeDetectorRef
  ) {}

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

  async setShops() {
    this.shownShops = await this.databaseSrv.getShops(
      this.lat,
      this.long,
      this.radius
    );
  }

  getUserLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
        this.set_shops();
      },
      (error) => {
        console.error('Error getting user location:', error);
        this.set_shops();
      }
    );
  }

  ionViewWillEnter() {
    this.getUserLocation();
  }
}
