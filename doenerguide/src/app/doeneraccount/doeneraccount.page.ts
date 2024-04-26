import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-doeneraccount',
  templateUrl: './doeneraccount.page.html',
  styleUrls: ['./doeneraccount.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class DoeneraccountPage implements OnInit {

  constructor(private userSrv: UserService, private router: Router) { }

  ngOnInit() {
    if (!this.userSrv.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.userSrv.getDoenerladenID() == null) {
      this.router.navigate(['/account']);
      return;
    }
  }

  openQRScan() {
    console.log('QR Code scannen');
  }

  navigateToAccountSettings() {
    console.log('Navigiere zu Account Einstellungen');
    // TODO: navigate to account settings
  }

  logout() {
    this.userSrv.logout();
    // this.router.navigate(['/home', { message: 'Logout erfolgreich' }]);
  }

}