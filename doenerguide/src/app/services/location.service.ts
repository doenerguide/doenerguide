import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  lat: number = environment.lat;
  long: number = environment.long;
  radius: number = environment.radius;

  constructor(private toastCtrl: ToastController) {
    Geolocation.checkPermissions().then((result) => {
      if (
        result.location === 'prompt' ||
        result.location === 'prompt-with-rationale'
      ) {
        Geolocation.requestPermissions().then((result) => {
          if (
            result.location === 'prompt' ||
            result.location === 'prompt-with-rationale' ||
            result.location === 'denied'
          ) {
            console.log('Location permission denied');
            toastCtrl
              .create({
                message:
                  'Die App benötigt Zugriff auf den Standort, um zu funktionieren. Bitte erlaube den Zugriff in den Einstellungen.',
                duration: 2000,
                color: 'danger',
                position: 'top',
                icon: 'location',
              })
              .then((toast) => toast.present());
          }
        });
      } else if (result.location === 'denied') {
        console.log('Location permission denied');
        toastCtrl
          .create({
            message:
              'Die App benötigt Zugriff auf den Standort, um zu funktionieren. Bitte erlaube den Zugriff in den Einstellungen.',
            duration: 2000,
            color: 'danger',
            position: 'top',
            icon: 'location',
          })
          .then((toast) => toast.present());
      }
    });
  }

  setLocation(lat: number, long: number) {
    this.lat = lat;
    this.long = long;
  }

  getLocation(): { lat: number; long: number } {
    return {
      lat: this.lat,
      long: this.long,
    };
  }

  setRadius(radius: number) {
    this.radius = radius;
  }

  getRadius(): number {
    return this.radius;
  }

  async getUserLocation(): Promise<{ lat: number; long: number }> {
    let loc = await Geolocation.getCurrentPosition();
    this.lat = loc.coords.latitude;
    this.long = loc.coords.longitude;
    return { lat: loc.coords.latitude, long: loc.coords.longitude };
  }
}
