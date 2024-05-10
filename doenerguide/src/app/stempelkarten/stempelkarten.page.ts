import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonSpinner,
  IonLabel,
  IonItem,
  IonButtons,
  IonBackButton,
  IonBadge,
  NavController,
} from '@ionic/angular/standalone';
import { DatabaseService } from '../services/database.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-stempelkarten',
  templateUrl: './stempelkarten.page.html',
  styleUrls: ['./stempelkarten.page.scss'],
  standalone: true,
  imports: [
    IonBadge,
    IonBackButton,
    IonButtons,
    IonItem,
    IonLabel,
    IonSpinner,
    IonList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
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

  objKeys = Object.keys;

  constructor(public databaseSrv: DatabaseService, private userSrv: UserService, private navCtrl: NavController) {}

  async ionViewWillEnter() {
    this.stamps = await this.databaseSrv.getAllUserStamps(this.userSrv.getUser().identification_code);
    console.log(this.stamps);
    for (const key in this.stamps) {
      if (this.stamps[key] > 0) {
        this.showStamps[key] = {
          name: (await this.databaseSrv.getShop(key)).name,
          amount: this.stamps[key],
        };
      }
    }
    console.log(this.showStamps);
    this.loading = false;
  }

  navigate(cardInformation: { name: string; amount: number }) {
    this.navCtrl.navigateForward(['/card', { stamps: JSON.stringify(cardInformation) }]);
  }
}
