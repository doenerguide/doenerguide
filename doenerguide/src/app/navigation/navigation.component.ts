import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class NavigationComponent {
  tab = 'login';
  constructor(public userSrv: UserService) {}

  ngOnInit() {
    this.reloadTab();
  }

  reloadTab() {
    if (this.userSrv.isLoggedIn()) {
      this.tab = 'account';
    } else {
      this.tab = 'login';
    }
  }
}
