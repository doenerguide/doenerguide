import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  public ready = false;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
    this.ready = true;
  }

  async waitTillReady() {
    while (!this.ready) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  public getDarkMode(value: boolean) {
    this._storage?.set('darkMode', value);
  }

  public async darkMode(): Promise<boolean> {
    return await this._storage?.get('darkMode');
  }

  public toggleDarkMode() {
    this.darkMode().then((value) => {
      this._storage?.set('darkMode', !value);
    });
  }
}
