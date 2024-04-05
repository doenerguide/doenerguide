import { Component, ElementRef, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { getUserLocation } from '../home/home.page';

declare let google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MapPage implements OnInit {

  @ViewChild('map', { static: true }) mapElementRef!: ElementRef;
  center = { lat: environment.lat, lng: environment.long };
  map: any;
  marker: any;
  infoWindow: any;
  mapListener: any;
  markerListener: any;
  intersectionObserver: any;
  private renderer = inject(Renderer2);

  constructor() { }

  ngOnInit() { }

  async ionViewDidEnter() {
    await getUserLocation();
    this.center = { lat: environment.lat, lng: environment.long };
    this.loadMap();
  }

  async loadMap() {
    const { Map } = await google.maps.importLibrary("maps");

    const mapEl = this.mapElementRef.nativeElement;

    const location = new google.maps.LatLng(this.center.lat, this.center.lng);

    this.map = new Map(mapEl, {
      center: location,
      zoom: 14,
      mapId: "37c2487cae047b8d",
      scaleControl: false,
      streetViewControl: false,
      zoomControl: true,
      overviewMapControl: false,
      mapTypeControl: false,
      fullscreenControl: false
    });

    console.log('shops: ', environment.shops);
    this.renderer.addClass(mapEl, 'visible');
    for (const shop of environment.shops as any[]) {
      this.addMarker(new google.maps.LatLng(shop.lat/1000000, shop.lng/1000000), "<img src='" + shop.imageUrl + "' style='width: 20em; height: auto;'><h2>" + shop.name + "</h2><p>" + shop.address + "</p><p>Rating: " + shop.rating + "</p><p>Price category: " + shop.priceCategory + "</p><p>Opening hours: " + shop.openingHours.opens + " - " + shop.openingHours.closes + "</p><p>Accepts card: " + shop.flags.acceptCard + "</p><p>Has stamp card: " + shop.flags.stampCard + "</p><a href='" + shop.mapsUrl + "'>Open in Google Maps</a><p>Tel: " + shop.tel + "</p>");
    }
  }


  addMarker(location: any, info: string) {
    const markerIcon = {
      url: 'assets/logo.png',
      scaledSize: new google.maps.Size(50, 50),
    };
  
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      draggable: true,
      icon: markerIcon,
    });
  
    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="color: black !important;">${info}</div>`
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
  
    marker.addListener("dragend", (event: any) => {
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
