import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, QRCodeModule],
})
export class AccountPage implements OnInit {
  myAngularxQrCode: string = "";
  constructor(private userSrv: UserService, private router: Router) { }


  ngOnInit() {
    this.generateQRCode();
  }

  generateQRCode() {
    let user = this.userSrv.getUser();
    this.myAngularxQrCode = user.identification_code;
  }

  logout() {
    this.userSrv.logout();
    this.router.navigate(['/home', { message: 'Logout erfolgreich' }]);
  }

}
