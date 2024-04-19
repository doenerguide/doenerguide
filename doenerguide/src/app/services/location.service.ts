import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  lat: number = environment.lat;
  long: number = environment.long;
  radius: number = environment.radius;

  constructor() {}

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
}
