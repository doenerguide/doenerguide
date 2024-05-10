import { Component, ElementRef, OnDestroy, Renderer2, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { LocationService } from '../services/location.service';
import { DatabaseService } from '../services/database.service';
import { Shop } from '../interfaces/shop';

declare let google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
})
export class MapPage implements OnDestroy {
  map: any;
  marker: any;
  infoWindow: any;
  mapListener: any;
  markerListener: any;
  intersectionObserver: any;
  private renderer = inject(Renderer2);

  shownShops: Shop[] = [];

  // Import components of the template page to be used in TypeScript
  @ViewChild('map', { static: true }) mapElementRef!: ElementRef;

  constructor(private locationSrv: LocationService, private databaseSrv: DatabaseService, private navCtrl: NavController) {}

  // Called every time the page is loaded, gets the user's location and sets the shops to be displayed. Will load the map
  async ionViewDidEnter() {
    try {
      let loc = await this.locationSrv.getUserLocation();
      this.locationSrv.lat = loc.lat;
      this.locationSrv.long = loc.long;
    } catch (e) {
      console.error(e);
    }
    this.loadMap();
  }

  /**
   * Change the radius of the search circle
   * @param event Event of the change
   */
  change_radius(event: any) {
    this.locationSrv.setRadius(event.detail.value);
    this.setShops();
  }

  /**
   * Set the shops shown on the map
   */
  async setShops() {
    this.shownShops = await this.databaseSrv.getShops(this.locationSrv.lat, this.locationSrv.long, this.locationSrv.radius);
  }

  /**
   * Load the map
   */
  async loadMap() {
    const mapEl = this.mapElementRef.nativeElement;

    const location = new google.maps.LatLng(this.locationSrv.lat, this.locationSrv.long);

    this.map = new google.maps.Map(mapEl, {
      center: location,
      zoom: 13.25 - 0.085 * this.locationSrv.radius,
      scaleControl: false,
      streetViewControl: false,
      zoomControl: true,
      overviewMapControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      styles: [
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
      ],
      disableDefaultUI: true,
    });

    this.set_circle(this.map, location, this.locationSrv.radius * 1000);
    this.renderer.addClass(mapEl, 'visible');
    await this.setShops();
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
  }

  /**
   * Set the circle of the area in which the shops are shown
   * @param map Map to set the circle on
   * @param center Center of the circle
   * @param radius Radius of the circle
   * @returns Circle object
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
   * Add a marker to the map, to show a shop
   * @param location Location of the marker
   * @param info Information to show when the marker is clicked
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
      if (infoWindow.getMap()) {
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
      this.map.panTo(event.latLng);
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
}
