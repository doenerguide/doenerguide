import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserService } from './services/user.service';
import { environment } from 'src/environments/environment';
import { DatabaseService } from './services/database.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent implements OnInit {
  session_id: string = '';

  constructor(private userSrv: UserService, private databaseSrv: DatabaseService, private storageSrv: StorageService) {}

  // Called when the page is first loaded, will fetch the user data and set the dark mode
  ngOnInit() {
    new Promise((resolve) => {
      this.storageSrv.waitTillReady().then(() => {
        this.fetchUserData();
        this.storageSrv.darkMode().then((value) => {
          if (value) {
            document.body.classList.add('dark');
            resolve(null);
          }
        });
      });
    });
  }

  /**
   * Initialize the session_id variable
   */
  async initializeSessionId() {
    let session_id = await this.storageSrv.getSessionToken();
    if (session_id) {
      this.session_id = session_id;
    } else {
      this.userSrv.logout();
    }
  }

  /**
   * Fetch the user data from the server by the session_id
   * If the session id is not valid, the user will be logged out
   */
  async fetchUserData() {
    await this.initializeSessionId();
    fetch(environment.endpoint + '/getUserBySession?session_id=' + this.session_id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data['success']) {
          let userData = data['user'];
          userData['favoriten'] = await Promise.all(userData['favoriten'].map(async (shop: any) => await this.databaseSrv.getShop(shop)));
          this.userSrv.setUser(data['user']);
        } else {
          this.userSrv.logout();
        }
      });
  }
}
