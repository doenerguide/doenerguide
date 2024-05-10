import { Component, OnInit } from '@angular/core';
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
export class NavigationComponent implements OnInit {
  tab = 'login';
  constructor(public userSrv: UserService) {}

  // Called when the page is first loaded, will reload the tabs to show the correct one
  ngOnInit() {
    this.reloadTab();
  }

  /**
   * Reload the tab to show the correct one, based on the user's login status
   */
  reloadTab() {
    if (this.userSrv.isLoggedIn()) {
      this.tab = 'account';
    } else {
      this.tab = 'login';
    }
  }
}
