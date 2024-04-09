import {
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { UserService } from '../services/user.service';

declare let google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class MapPage {
  @ViewChild('map', { static: true }) mapElementRef!: ElementRef;
  center = { lat: environment.lat, lng: environment.long };
  map: any;
  marker: any;
  infoWindow: any;
  mapListener: any;
  markerListener: any;
  intersectionObserver: any;
  private renderer = inject(Renderer2);

  constructor(private userSrv: UserService) {}

  async ionViewDidEnter() {
    let location = await this.userSrv.getUserLocation();
    this.center = { lat: location.lat, lng: location.long };
    this.loadMap();
  }

  async loadMap() {
    const { Map } = await google.maps.importLibrary('maps');

    const mapEl = this.mapElementRef.nativeElement;

    const location = new google.maps.LatLng(this.center.lat, this.center.lng);

    this.map = new google.maps.Map(mapEl, {
      center: location,
      zoom: 13.25 - 0.085 * environment.radius,
      scaleControl: false,
      streetViewControl: false,
      zoomControl: true,
      overviewMapControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#1F1F1F' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1F1F1F' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#E1E6EC' }],
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#38414e' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#212a37' }],
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#9ca5b3' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#746855' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#1f2835' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#f3d19c' }],
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{ color: '#2f3948' }],
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#17263c' }],
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#515c6d' }],
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#17263c' }],
        },
      ],
      disableDefaultUI: true,
    });

    console.log('shops: ', environment.shops);
    this.set_circle(this.map, location, environment.radius * 1000);
    this.renderer.addClass(mapEl, 'visible');
    for (const shop of environment.shops as any[]) {
      this.addMarker(
        new google.maps.LatLng(shop.lat, shop.lng),
        "<img src='" +
          shop.imageUrl +
          "' style='width: 20em; height: auto;'><h2>" +
          shop.name +
          '</h2><p>' +
          shop.address +
          '</p><p>Rating: ' +
          shop.rating +
          '</p><p>Price category: ' +
          shop.priceCategory +
          '</p><p>Opening hours: ' +
          shop.openingHours.opens +
          ' - ' +
          shop.openingHours.closes +
          '</p><p>Accepts card: ' +
          shop.flags.acceptCard +
          '</p><p>Has stamp card: ' +
          shop.flags.stampCard +
          "</p><a href='" +
          shop.mapsUrl +
          "'>Open in Google Maps</a><p>Tel: " +
          shop.tel +
          '</p>'
      );
    }
  }

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
      console.log(event.latLng.lat());
      marker.setPosition(event.latLng);
      this.map.panTo(event.latLng);
    });
  }

  ngOnDestroy(): void {
    if (this.mapListener) {
      google.maps.event.removeListener(this.mapListener);
      this.mapListener = null;
    }
    if (this.markerListener) {
      this.marker.removeEventListener('dragend', this.markerListener);
      this.markerListener = null;
    }

    console.log('marker listener: ', this.markerListener);
    console.log('map listener: ', this.mapListener);
  }
}
