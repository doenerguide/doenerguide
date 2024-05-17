import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { LocationService } from '../services/location.service';
import { DatabaseService } from '../services/database.service';
import { Shop } from '../interfaces/shop';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
})
export class MapPage implements OnDestroy, OnInit {
  map: google.maps.Map | null = null;
  currentCircle: google.maps.Circle | null = null;
  marker: any;
  infoWindow: any;
  mapListener: any;
  markerListener: any;
  intersectionObserver: any;
  private renderer = inject(Renderer2);

  shownShops: Shop[] = [];
  location: any;
  currentDark = false;

  mapsLoader = new Loader({
    apiKey: environment.mapsApiKey,
    version: 'weekly',
  });

  // Import components of the template page to be used in TypeScript
  @ViewChild('map', { static: true }) mapElementRef!: ElementRef;

  constructor(private locationSrv: LocationService, private databaseSrv: DatabaseService, private navCtrl: NavController, private storageSrv: StorageService) {}

  // Called if the page is loaded the first time, gets the user's location and sets the shops to be displayed. Will load the map
  async ngOnInit() {
    try {
      let loc = await this.locationSrv.getUserLocation();
      this.locationSrv.lat = loc.lat;
      this.locationSrv.long = loc.long;
    } catch (e) {
      console.error(e);
    }
    this.location = new google.maps.LatLng(this.locationSrv.lat, this.locationSrv.long);
    this.loadMap();
  }

  /**
   * Called when the page is entered, will update the map and the shops shown
   */
  ionViewWillEnter() {
    this.storageSrv.darkMode().then((dark) => {
      if (dark != this.currentDark) {
        this.loadMap();
      }
    });
    this.location = new google.maps.LatLng(this.locationSrv.lat, this.locationSrv.long);
    this.setShops().then(() => {
      if (this.currentCircle) {
        this.currentCircle.setMap(null);
      }
      this.currentCircle = this.set_circle(this.map, this.location, this.locationSrv.radius * 1000);
      for (const shop of this.shownShops) {
        this.addMarker(
          new google.maps.LatLng(shop.lat, shop.lng),
          '<h2>' +
            shop.name +
            '</h2><p>' +
            shop.address +
            '</p><ion-button size="small" shop="' +
            shop.id +
            '" class="moreInfo">Mehr Informationen <ion-icon name="arrow-forward-outline" slot="end" /> </ion-button>'
        );
      }
    });
  }

  /**
   * Called when the user changes the radius, will update the shops shown
   * @param event Event of the change
   */
  change_radius(event: any) {
    this.locationSrv.setRadius(event.detail.value);
    this.setShops();
  }

  /**
   * Set the shops to be shown
   */
  async setShops() {
    this.shownShops = await this.databaseSrv.getShops(this.locationSrv.lat, this.locationSrv.long, this.locationSrv.radius);
  }

  /**
   * Load the map
   */
  async loadMap() {
    const mapEl = this.mapElementRef.nativeElement;

    this.mapsLoader.importLibrary('core').then(async () => {
      const { Map } = (await this.mapsLoader.importLibrary('maps')) as google.maps.MapsLibrary;

      let mapsStyle = await this.getMapsStyle();
      this.map = new Map(mapEl, {
        center: this.location,
        zoom: 13.25 - 0.085 * this.locationSrv.radius,
        scaleControl: false,
        streetViewControl: false,
        zoomControl: true,
        mapTypeControl: false,
        fullscreenControl: false,
        styles: mapsStyle,
        disableDefaultUI: true,
      });

      this.renderer.addClass(mapEl, 'visible');
    });
  }

  /**
   * Set a circle on the map
   * @param map Map to set the circle on
   * @param center Center of the circle
   * @param radius Radius of the circle
   * @returns The circle
   */
  set_circle = (map: any, center: any, radius: number) => {
    return new google.maps.Circle({
      strokeColor: '#1E7FF3',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#1AADEB',
      fillOpacity: 0.1,
      map,
      center,
      radius,
    });
  };

  /**
   * Add a marker to the map
   * @param location Location of the marker
   * @param info Info to be shown in the info window
   */
  addMarker(location: any, info: string) {
    const markerIcon = {
      url: 'assets/logo.png',
      scaledSize: new google.maps.Size(50, 50),
    };

    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      // draggable: true,
      icon: markerIcon,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="color: black !important;">${info}</div>`,
    });

    infoWindow.addListener('domready', () => {
      let buttons = document.getElementsByClassName('moreInfo');
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', () => {
          let shopId = buttons[i].getAttribute('shop');
          let shop = this.shownShops.find((s) => s.id == shopId);
          this.navCtrl.navigateForward(['/shop', { shop: JSON.stringify(shop) }]);
        });
      }
    });

    marker.addListener('click', () => {
      if (infoWindow == this.infoWindow) {
        infoWindow.close();
        this.infoWindow = null;
      } else {
        if (this.infoWindow) {
          this.infoWindow.close();
          this.infoWindow = null;
        }
        infoWindow.open(this.map, marker);
        this.infoWindow = infoWindow;
      }
    });

    marker.addListener('dragend', (event: any) => {
      marker.setPosition(event.latLng);
      this.map!.panTo(event.latLng);
    });
  }

  // Remove the listeners when the page is left
  ngOnDestroy(): void {
    if (this.mapListener) {
      google.maps.event.removeListener(this.mapListener);
      this.mapListener = null;
    }
    if (this.markerListener) {
      this.marker.removeEventListener('dragend', this.markerListener);
      this.markerListener = null;
    }
  }

  async getMapsStyle() {
    if (await this.storageSrv.darkMode()) {
      this.currentDark = true;
      return [
        {
          featureType: 'all',
          elementType: 'labels',
          stylers: [
            {
              visibility: 'on',
            },
          ],
        },
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [
            {
              saturation: 36,
            },
            {
              color: '#000000',
            },
            {
              lightness: 40,
            },
          ],
        },
        {
          featureType: 'all',
          elementType: 'labels.text.stroke',
          stylers: [
            {
              visibility: 'on',
            },
            {
              color: '#000000',
            },
            {
              lightness: 16,
            },
          ],
        },
        {
          featureType: 'all',
          elementType: 'labels.icon',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'administrative',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#000000',
            },
            {
              lightness: 20,
            },
          ],
        },
        {
          featureType: 'administrative',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#000000',
            },
            {
              lightness: 17,
            },
            {
              weight: 1.2,
            },
          ],
        },
        {
          featureType: 'administrative.country',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#e5c163',
            },
          ],
        },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#c4c4c4',
            },
          ],
        },
        {
          featureType: 'administrative.neighborhood',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#e5c163',
            },
          ],
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [
            {
              color: '#000000',
            },
            {
              lightness: 20,
            },
          ],
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [
            {
              color: '#000000',
            },
            {
              lightness: 21,
            },
            {
              visibility: 'on',
            },
          ],
        },
        {
          featureType: 'poi.business',
          elementType: 'geometry',
          stylers: [
            {
              visibility: 'on',
            },
          ],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#e5c163',
            },
            {
              lightness: '0',
            },
          ],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#ffffff',
            },
          ],
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.stroke',
          stylers: [
            {
              color: '#e5c163',
            },
          ],
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry',
          stylers: [
            {
              color: '#000000',
            },
            {
              lightness: 18,
            },
          ],
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#575757',
            },
          ],
        },
        {
          featureType: 'road.arterial',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#ffffff',
            },
          ],
        },
        {
          featureType: 'road.arterial',
          elementType: 'labels.text.stroke',
          stylers: [
            {
              color: '#2c2c2c',
            },
          ],
        },
        {
          featureType: 'road.local',
          elementType: 'geometry',
          stylers: [
            {
              color: '#000000',
            },
            {
              lightness: 16,
            },
          ],
        },
        {
          featureType: 'road.local',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#999999',
            },
          ],
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [
            {
              color: '#000000',
            },
            {
              lightness: 19,
            },
          ],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [
            {
              color: '#000000',
            },
            {
              lightness: 17,
            },
          ],
        },
      ];
    } else {
      this.currentDark = false;
      return [
        {
          featureType: 'landscape.man_made',
          elementType: 'geometry',
          stylers: [
            {
              color: '#f7f1df',
            },
          ],
        },
        {
          featureType: 'landscape.natural',
          elementType: 'geometry',
          stylers: [
            {
              color: '#d0e3b4',
            },
          ],
        },
        {
          featureType: 'landscape.natural.terrain',
          elementType: 'geometry',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'poi.business',
          elementType: 'all',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'poi.medical',
          elementType: 'geometry',
          stylers: [
            {
              color: '#fbd3da',
            },
          ],
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [
            {
              color: '#bde6ab',
            },
          ],
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'road',
          elementType: 'labels',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#ffe15f',
            },
          ],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#efd151',
            },
          ],
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#ffffff',
            },
          ],
        },
        {
          featureType: 'road.local',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: 'black',
            },
          ],
        },
        {
          featureType: 'transit.station.airport',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#cfb2db',
            },
          ],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [
            {
              color: '#a2daf2',
            },
          ],
        },
      ];
    }
  }
}
