import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { User } from '../interfaces/user';
import { DatabaseService } from '../services/database.service';
import { ToastController } from '@ionic/angular/standalone';
import { StorageService } from '../services/storage.service';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Shop } from '../interfaces/shop';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, QRCodeModule],
})
export class AccountPage implements OnInit {
  myAngularxQrCode: string = '';
  user!: User;
  passwordOld: string = '';
  passwordNew: string = '';
  passwordConfirm: string = '';
  darkMode = false;

  qrSupported = false;
  shop: Shop | undefined;

  @ViewChild('sidebutton', { read: ElementRef }) sideButton!: ElementRef;

  constructor(
    private userSrv: UserService,
    private router: Router,
    private databaseSrv: DatabaseService,
    private toastCtrl: ToastController,
    private storageSrv: StorageService,
    private platform: Platform
  ) {}

  ngOnInit() {
    if (this.userSrv.isLoggedIn()) this.user = this.userSrv.getUser();
    else this.router.navigate(['/login']);
    if (this.user.doenerladen) {
      this.databaseSrv.getShop(this.user.doenerladen).then((shop) => (this.shop = shop));
      BarcodeScanner.isSupported().then((result) => {
        this.qrSupported = result.supported;
      });
    }
  }

  ionViewWillEnter() {
    this.user = this.userSrv.getUser();
    this.generateQRCode();
    this.storageSrv.darkMode().then((value) => {
      this.darkMode = value;
    });
  }

  generateQRCode() {
    this.myAngularxQrCode = this.user.identification_code ?? '';
  }

  logout() {
    this.sideButton.nativeElement.classList.remove('side');
    this.userSrv.logout();
    this.router.navigate(['/home', { message: 'Logout erfolgreich' }]);
  }

  toggleDarkMode() {
    this.storageSrv.toggleDarkMode();
    document.body.classList.toggle('dark');
  }

  updateUser() {
    this.databaseSrv.updateUser(this.user).then((success) => {
      if (success) {
        if (this.passwordNew !== '' && this.passwordOld !== '' && this.passwordOld === this.passwordConfirm) {
          this.databaseSrv.updateUserPassword(this.user.id, this.passwordOld, this.passwordNew);
        } else if (this.passwordNew !== '' && this.passwordOld !== '' && this.passwordOld !== this.passwordConfirm) {
          this.toastCtrl
            .create({
              message: 'Passwörter stimmen nicht überein',
              duration: 2000,
              color: 'danger',
              position: 'top',
            })
            .then((toast) => toast.present());
        }
        this.toastCtrl
          .create({
            message: 'Benutzerdaten erfolgreich aktualisiert',
            duration: 2000,
            color: 'success',
            position: 'top',
          })
          .then((toast) => toast.present());
      } else {
        this.toastCtrl
          .create({
            message: 'Fehler beim Aktualisieren der Benutzerdaten',
            duration: 2000,
            color: 'danger',
            position: 'top',
          })
          .then((toast) => toast.present());
      }
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
