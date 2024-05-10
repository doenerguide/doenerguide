import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  public ready = false;

  // Create a new storage instance
  constructor(private storage: Storage) {
    this.init();
  }

  /**
   * Initialize the storage service
   */
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this.ready = true;
  }

  /**
   * Wait until the storage is ready
   */
  async waitTillReady() {
    while (!this.ready) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  /**
   * Check if dark mode is enabled
   * @returns True if dark mode is enabled, false otherwise
   */
  public async darkMode(): Promise<boolean> {
    return await this._storage?.get('darkMode');
  }

  /**
   * Toggle dark mode
   */
  public toggleDarkMode() {
    this.darkMode().then((value) => {
      this._storage?.set('darkMode', !value);
    });
  }
}
