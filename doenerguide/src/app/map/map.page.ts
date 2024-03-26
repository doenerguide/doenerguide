import { Component, ElementRef, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

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
  center = { lat: 48.783333, lng: 9.183333 };
  map: any;
  marker: any;
  mapListener: any;
  markerListener: any;
  intersectionObserver: any;
  private renderer = inject(Renderer2);

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.loadMap();

    this.intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('drop');
          this.intersectionObserver.unobserve(entry.target);
        }
      }
    });
  }

  async loadMap() {
    const { Map } = await google.maps.importLibrary("maps");

    const mapEl = this.mapElementRef.nativeElement;

    const location = new google.maps.LatLng(48.783333, 9.183333);

    this.map = new Map(mapEl, {
      center: location,
      zoom: 14,
      mapId: "37c2487cae047b8d",
      // scaleControl: false,
      // streetViewControl: false,
      // zoomControl: false,
      // overviewMapControl: false,
      mapTypeControl: true,
      // fullscreenControl: false,
    });

    this.renderer.addClass(mapEl, 'visible');
    this.addMarker(location,'<h1>Store A</h1><p>Store Description</p>');
    this.addMarker(new google.maps.LatLng(48.793333, 9.193333),'<h1>Store B</h1><p>Store Description</p>');
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
      infoWindow.open(this.map, marker);
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