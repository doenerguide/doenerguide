import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { User } from '../interfaces/user';
import { DatabaseService } from '../services/database.service';
import { ToastController } from '@ionic/angular/standalone';
import { StorageService } from '../services/storage.service';

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
  password: string = '';
  passwordConfirm: string = '';
  darkMode = false;

  @ViewChild('sidebutton', { read: ElementRef }) sideButton!: ElementRef;

  constructor(
    private userSrv: UserService,
    private router: Router,
    private databaseSrv: DatabaseService,
    private toastCtrl: ToastController,
    private storageSrv: StorageService
  ) {}

  ngOnInit() {
    this.user = this.userSrv.getUser();
    console.log(this.user);
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
        if (this.password !== '' && this.password === this.passwordConfirm) {
          this.databaseSrv.updateUserPassword(this.user.id, this.password);
        } else if (
          this.password !== '' &&
          this.password !== this.passwordConfirm
        ) {
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
}
