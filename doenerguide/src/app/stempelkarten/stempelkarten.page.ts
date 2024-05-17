import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { DatabaseService } from '../services/database.service';
import { UserService } from '../services/user.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-stempelkarten',
  templateUrl: './stempelkarten.page.html',
  styleUrls: ['./stempelkarten.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class StempelkartenPage {
  stamps: {
    [id: number]: number;
  } = {};
  showStamps: {
    [id: number]: {
      name: string;
      amount: number;
    };
  } = {};
  loading = true;

  // Definition of the functions and variables used in the template
  objKeys = Object.keys;

  constructor(public databaseSrv: DatabaseService, private userSrv: UserService, private navCtrl: NavController) {}

  // Called every time the page is loaded, will load the user's stamps
  async ionViewWillEnter() {
    this.stamps = await this.databaseSrv.getAllUserStamps(this.userSrv.getUser().identification_code);
    for (const key in this.stamps) {
      if (this.stamps[key] > 0) {
        this.showStamps[key] = {
          name: (await this.databaseSrv.getShop(key)).name,
          amount: this.stamps[key],
        };
      }
    }
    this.loading = false;
  }

  /**
   * Navigate to the card page
   * @param cardInformation Information about the card to be shown
   */
  navigate(cardInformation: { name: string; amount: number }) {
    this.navCtrl.navigateForward(['/card', { stamps: JSON.stringify(cardInformation) }]);
  }
}
