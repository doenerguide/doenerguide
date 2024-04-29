import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  InputChangeEventDetail,
  IonicModule,
  RefresherCustomEvent,
  SearchbarCustomEvent,
  SearchbarInputEventDetail,
} from '@ionic/angular';
import { NavigationComponent } from '../navigation/navigation.component';
import { Shop, ShopFunctions } from '../interfaces/shop';
import { RatingComponent } from '../rating/rating.component';
import { CommonModule } from '@angular/common';
import { PriceComponent } from '../price/price.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { DatabaseService } from '../services/database.service';
import { UserService } from '../services/user.service';
import { IFlags, flagList } from '../interfaces/flags';
import { LocationService } from '../services/location.service';
import { FilterPipe } from '../pipes/filter.pipe';
import { StorageService } from '../services/storage.service';

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
    FilterPipe,
  ],
})

/**
 * Represents the home page of the application.
 */
export class HomePage {
  shownShops: Shop[] = [];
  radiusShops: Shop[] = [];
  flags: { key: string; value: string }[] = [];
  nameFilter: string = '';
  lat: number = 52.520008;
  long: number = 13.404954;
  radius: number = 5;

  logoSrc = 'assets/logo_header.png';

  @ViewChild('refreshButton', { read: ElementRef })
  refButton!: ElementRef<HTMLIonButtonElement>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastCtrl: ToastController,
    private router: Router,
    private databaseSrv: DatabaseService,
    public userSrv: UserService,
    private locationSrv: LocationService,
    private storageSrv: StorageService
  ) {}

  shopFunctions = ShopFunctions;
  flagList = flagList;

  pinFormatter(value: number) {
    return `${value}km`;
  }

  change_radius(event: any) {
    this.radius = event.detail.value;
    this.locationSrv.setRadius(this.radius);
    this.setShops();
  }

  async setShops() {
    this.radiusShops = await this.databaseSrv.getShops(
      this.lat,
      this.long,
      this.radius
    );
    this.shownShops = this.radiusShops.filter((shop) =>
      this.filterShopsMethod(shop)
    );
  }

  filterShopsMethod(shop: Shop): boolean {
    if (this.flags.length === 0 && this.nameFilter === '') return true;
    else if (this.nameFilter === '')
      return this.flags.every(
        (activeFlag) => (shop.flags as unknown as IFlags)[activeFlag.key]
      );
    else if (this.flagList.length === 0)
      return shop.name.toLowerCase().includes(this.nameFilter.toLowerCase());
    else
      return (
        shop.name.toLowerCase().includes(this.nameFilter.toLowerCase()) &&
        this.flags.every(
          (activeFlag) => (shop.flags as unknown as IFlags)[activeFlag.key]
        )
      );
  }

  handleFlag(flag: { key: string; value: string }) {
    if (this.flags.includes(flag)) {
      this.flags = this.flags.filter((f) => f !== flag);
    } else {
      this.flags.push(flag);
    }
    this.shownShops = this.radiusShops.filter((shop) =>
      this.filterShopsMethod(shop)
    );
  }

  fitlerFlags(
    flag: { key: string; value: string },
    flags: { key: string; value: string }[]
  ) {
    return flags.includes(flag);
  }

  ionViewWillEnter() {
    this.storageSrv.darkMode().then((darkMode) => {
      if (darkMode) this.logoSrc = 'assets/logo_header_white.png';
      else this.logoSrc = 'assets/logo_header.png';
    });
    this.userSrv.getUserLocation().then((loc) => {
      this.lat = loc.lat;
      this.long = loc.long;
      this.locationSrv.setLocation(this.lat, this.long);
      this.setShops();
    });
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

  doRefresh(event?: RefresherCustomEvent, button?: ElementRef) {
    if (button) button.nativeElement.classList.add('refreshing');
    this.userSrv.getUserLocation().then((loc) => {
      this.lat = loc.lat;
      this.long = loc.long;
      this.locationSrv.setLocation(this.lat, this.long);
      this.setShops();
      if (event) event.detail.complete();
      if (button) {
        setTimeout(() => {
          button.nativeElement.classList.remove('refreshing');
          this.toastCtrl
            .create({
              message: 'Du siehst jetzt die neuen Dönerläden in deiner Nähe!',
              duration: 2000,
              color: 'success',
              icon: 'checkmark-circle-outline',
              position: 'top',
            })
            .then((toast) => toast.present());
        }, 1000);
      }
    });
  }

  filterShops(event: SearchbarCustomEvent) {
    this.nameFilter = event.detail.value!;
    this.shownShops = this.radiusShops.filter((shop) =>
      this.filterShopsMethod(shop)
    );
  }
}
