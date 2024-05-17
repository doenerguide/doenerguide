import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonicModule, NavController, RefresherCustomEvent, SearchbarCustomEvent } from '@ionic/angular';
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
  imports: [IonicModule, NavigationComponent, RatingComponent, CommonModule, PriceComponent, RouterModule, FilterPipe],
})

/**
 * Represents the home page of the application.
 */
export class HomePage implements OnInit {
  shownShops: Shop[] = []; // List of shops to be shown on the page. Gets updated when the user scrolls to bottom
  shops: Shop[] = []; // List of all filtered shops
  radiusShops: Shop[] = []; // List of all shops in the radius
  flags: { key: string; value: string }[] = []; // List of active flags to filter the shops
  nameFilter: string = ''; // Name filter to filter the shops
  lat: number = 52.520008; // Latitude of the user
  long: number = 13.404954; // Longitude of the user
  radius: number = 5; // Radius in which the shops should be shown
  resultsShown: number = 12; // Amount of shops to be shown. Gets updated when the user scrolls to bottom
  loading = true; // Loading variable to show the loading spinner

  logoSrc = 'assets/logo_header.png';

  // Definition of the functions and variables used in the template
  shopFunctions = ShopFunctions;
  flagList = flagList;

  // Import components of the template page to be used in TypeScript
  @ViewChild('refreshButton', { read: ElementRef }) refButton!: ElementRef<HTMLIonButtonElement>;
  @ViewChild('topButton', { read: ElementRef }) topButton!: ElementRef<HTMLIonButtonElement>;
  @ViewChild(IonContent) content!: IonContent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastCtrl: ToastController,
    private router: Router,
    private databaseSrv: DatabaseService,
    public userSrv: UserService,
    private locationSrv: LocationService,
    private storageSrv: StorageService,
    private navCtrl: NavController
  ) {}

  // Called when the page is first loaded, gets the user's location and sets the shops to be displayed
  ngOnInit(): void {
    this.locationSrv.getUserLocation().then((loc) => {
      this.lat = loc.lat;
      this.long = loc.long;
      this.setShops();
    });
  }

  // Called everytime when the page is entered, sets the logo source, color mode and shows a toast if a message is in the URL
  ionViewWillEnter() {
    this.storageSrv.darkMode().then((darkMode) => {
      if (darkMode) this.logoSrc = 'assets/logo_header_white.png';
      else this.logoSrc = 'assets/logo_header.png';
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

  /**
   * Formatter for the distance
   * @param value Value to be formatted
   * @returns The formatted value
   */
  pinFormatter(value: number) {
    return `${value}km`;
  }

  /**
   * Changes the radius of the shops to be shown
   * @param event Event that triggered the change
   */
  change_radius(event: any) {
    this.radius = event.detail.value;
    this.locationSrv.setRadius(this.radius);
    this.setShops();
  }

  /**
   * Sets the shops based on the user's location
   */
  async setShops() {
    this.radiusShops = (await this.databaseSrv.getShops(this.lat, this.long, this.radius)).sort((a, b) => {
      if (a.distance && b.distance) return a.distance - b.distance;
      return 0;
    });
    this.shops = this.radiusShops.filter((shop) => this.filterShopsMethod(shop));
    this.setResultsShown();
    this.loading = false;
  }

  /**
   * Adds shops to the list of shown shops
   */
  setResultsShown() {
    this.shownShops = this.shops.slice(0, this.resultsShown);
  }

  /**
   * Loads more shops to be shown
   */
  loadMore() {
    this.resultsShown += 12;
    this.setResultsShown();
  }

  /**
   * Loads the standard amount of shops to be shown
   */
  loadStandard() {
    this.resultsShown = 12;
    this.setResultsShown();
  }

  /**
   * Handles the scroll event
   * Will load more shops if the user scrolls to the bottom of the page
   * @param event Event that triggered the scroll
   */
  async onScroll(event: any) {
    const scrollElement = await this.content.getScrollElement();
    if (scrollElement.scrollTop >= scrollElement.scrollHeight - scrollElement.clientHeight - 200) {
      this.loadMore();
    }
    if (scrollElement.scrollTop >= 50) {
      this.topButton.nativeElement.classList.remove('ion-hide');
    } else {
      this.topButton.nativeElement.classList.add('ion-hide');
    }
  }

  /**
   * Filters the shops based on the flags and name filter
   * @param shop Shop to be checked
   * @returns True if the shop should be shown, false otherwise
   */
  filterShopsMethod(shop: Shop): boolean {
    if (this.flags.length === 0 && this.nameFilter === '') return true;
    else if (this.nameFilter === '') return this.flags.every((activeFlag) => (shop.flags as unknown as IFlags)[activeFlag.key]);
    else if (this.flagList.length === 0) return shop.name.toLowerCase().includes(this.nameFilter.toLowerCase());
    else
      return (
        shop.name.toLowerCase().includes(this.nameFilter.toLowerCase()) && this.flags.every((activeFlag) => (shop.flags as unknown as IFlags)[activeFlag.key])
      );
  }

  /**
   * Handles the flag selection
   * Will add the flag to the list of active flags if it is not in the list and remove it if it is in the list
   * @param flag Flag to be handled
   */
  handleFlag(flag: { key: string; value: string }) {
    if (this.flags.includes(flag)) {
      this.flags = this.flags.filter((f) => f !== flag);
    } else {
      this.flags.push(flag);
    }
    this.shops = this.radiusShops.filter((shop) => this.filterShopsMethod(shop));
    this.setResultsShown();
  }

  /**
   * Checks if the flag is in the list of active flags
   * @param flag Flag to be checked
   * @param flags List of active flags
   * @returns True if the flag is in the list, false otherwise
   */
  fitlerFlags(flag: { key: string; value: string }, flags: { key: string; value: string }[]) {
    return flags.includes(flag);
  }

  /**
   * Refreshes the shops to be shown
   * @param event Event that triggered the refresh
   * @param button Button that triggered the refresh
   */
  doRefresh(event?: RefresherCustomEvent, button?: ElementRef) {
    if (button) button.nativeElement.classList.add('refreshing');
    this.locationSrv.getUserLocation().then((loc) => {
      this.lat = loc.lat;
      this.long = loc.long;
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

  /**
   * Filters the shops based on the name filter
   * @param event Event that triggered the search
   */
  filterShops(event: SearchbarCustomEvent) {
    this.nameFilter = event.detail.value!;
    this.shops = this.radiusShops.filter((shop) => this.filterShopsMethod(shop));
    this.setResultsShown();
  }

  /**
   * Scrolls to the top of the page
   */
  scrollToTop() {
    this.content.scrollToTop(500);
  }

  /**
   * Navigates to the shop page
   * @param shop Shop to be shown
   * @param event Event that triggered the navigation
   */
  navigateToShop(shop: Shop, event: Event) {
    if ((event.target as Element).classList.contains('favoriteButton')) return;

    this.navCtrl.navigateForward(['/shop', { shop: JSON.stringify(shop) }]);
  }
}
