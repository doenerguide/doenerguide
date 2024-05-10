import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { DatabaseService } from '../services/database.service';
import { UserService } from '../services/user.service';
import { Shop } from '../interfaces/shop';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-doeneraccount',
  templateUrl: './doeneraccount.page.html',
  styleUrls: ['./doeneraccount.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
})
export class DoeneraccountPage implements OnInit {
  shop: Shop | undefined;
  user: User | undefined;

  qrSupported = false;

  constructor(
    private databaseSrv: DatabaseService,
    private userSrv: UserService,
    private router: Router,
    private toastCtrl: ToastController,
    private platform: Platform
  ) {}

  async ngOnInit() {
    if (this.userSrv.isLoggedIn() && (this.user = this.userSrv.getUser()).doenerladen) {
      this.shop = await this.databaseSrv.getShop(this.user.doenerladen);
    }
    else this.router.navigate(['/account']);
    BarcodeScanner.isSupported().then((result) => {
      this.qrSupported = result.supported;
    });
  }

  async scanQR(): Promise<string> {
    const grantedPerms = await BarcodeScanner.checkPermissions();
    if (grantedPerms.camera === 'denied') {
      let perms = await BarcodeScanner.requestPermissions();
      if (perms.camera === 'denied') {
        await this.toastCtrl
          .create({
            message: 'Zum Scannen von QR-Codes benötigen wir Zugriff auf deine Kamera',
            duration: 2000,
            color: 'danger',
            icon: 'camera-off',
          })
          .then((toast) => toast.present());
        return '';
      }
    }
    if (this.platform.is('android')) {
      if (!(await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable())) {
        await BarcodeScanner.installGoogleBarcodeScannerModule();
      }
    }
    const { barcodes } = await BarcodeScanner.scan();
    if (barcodes.length === 0) return '';
    const barcode = barcodes[0];
    if (barcode.format !== 'QR_CODE') {
      await this.toastCtrl
        .create({
          message: 'Bitte scanne nur QR-Codes',
          duration: 2000,
          color: 'danger',
          icon: 'barcode',
        })
        .then((toast) => toast.present());
      return '';
    }
    let barcodeData = barcode.displayValue;
    return barcodeData;
  }

  async addStamp() {
    let identificationCode = await this.scanQR();
    if (identificationCode === '') return;
    let doenerladen_id = this.user?.doenerladen;
    if (doenerladen_id === undefined) return;
    let result = await this.databaseSrv.addUserStamp(identificationCode, doenerladen_id);
    if (result['success']) {
      this.toastCtrl
        .create({
          message: 'Stempel hinzugefügt',
          duration: 2000,
          color: 'success',
          position: 'top',
        })
        .then((toast) => toast.present());
    } else {
      this.toastCtrl
        .create({
          message: result['message'],
          duration: 2000,
          color: 'danger',
          position: 'top',
        })
        .then((toast) => toast.present());
    }
  }

  async removeStamps() {
    let identificationCode = await this.scanQR();
    if (identificationCode === '') return;
    let doenerladen_id = this.user?.doenerladen;
    if (doenerladen_id === undefined) return;
    let amount = await this.databaseSrv.getUserStamps(identificationCode, doenerladen_id);
    if (amount !== 10) {
      this.toastCtrl
        .create({
          message: 'Nicht genügend Stempel. Es fehlen noch ' + (10 - amount) + ' Stempel',
          duration: 2000,
          color: 'danger',
          position: 'top',
        })
        .then((toast) => toast.present());
      return;
    }
    let result = await this.databaseSrv.removeUserStamps(identificationCode, doenerladen_id);
    if (result['success']) {
      this.toastCtrl
        .create({
          message: 'Stempelkarte wurde eingelöst!',
          duration: 2000,
          color: 'success',
          position: 'top',
        })
        .then((toast) => toast.present());
    } else {
      this.toastCtrl
        .create({
          message: result['message'],
          duration: 2000,
          color: 'danger',
          position: 'top',
        })
        .then((toast) => toast.present());
    }
  }
}