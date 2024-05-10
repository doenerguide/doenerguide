import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Platform, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  lat: number = environment.lat;
  long: number = environment.long;
  radius: number = environment.radius;

  // Check if the location permission is granted, if not, request it
  constructor(private toastCtrl: ToastController, private platform: Platform) {
    if (this.platform.is('capacitor'))
      Geolocation.checkPermissions().then((result) => {
        if (result.location === 'prompt' || result.location === 'prompt-with-rationale' || result.location === 'denied') {
          Geolocation.requestPermissions().then((result) => {
            if (result.location === 'prompt' || result.location === 'prompt-with-rationale' || result.location === 'denied') {
              this.toastCtrl
                .create({
                  message: 'Die App benötigt Zugriff auf den Standort, um zu funktionieren. Bitte erlaube den Zugriff in den Einstellungen.',
                  duration: 2000,
                  color: 'danger',
                  position: 'top',
                  icon: 'location',
                })
                .then((toast) => toast.present());
            }
          });
        }
      });
  }

  /**
   * Set current locatiom
   * @param lat Latitude
   * @param long Longitude
   */
  setLocation(lat: number, long: number) {
    this.lat = lat;
    this.long = long;
  }

  /**
   * Get the current location
   * @returns Location object with latitude and longitude
   */
  getLocation(): { lat: number; long: number } {
    return {
      lat: this.lat,
      long: this.long,
    };
  }

  /**
   * Set the radius which was set by the user
   * @param radius Radius
   */
  setRadius(radius: number) {
    this.radius = radius;
  }

  /**
   * Get the radius which was set by the user
   * @returns Radius
   */
  getRadius(): number {
    return this.radius;
  }

  /**
   * Get current users location
   * @returns The location of the user with latitude and longitude
   */
  async getUserLocation(): Promise<{ lat: number; long: number }> {
    let loc = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
    this.lat = loc.coords.latitude;
    this.long = loc.coords.longitude;
    return { lat: loc.coords.latitude, long: loc.coords.longitude };
  }
}
