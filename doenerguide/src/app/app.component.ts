import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserService } from './services/user.service';
import { environment } from 'src/environments/environment';
import { DatabaseService } from './services/database.service';
import { Shop } from './interfaces/shop';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent implements OnInit {
  session_id: string = '';

  constructor(private userSrv: UserService, private databaseSrv: DatabaseService) {}

  ngOnInit() {
    this.fetchUserData();
  }

  getCookie(name: string) {
    let cookie = document.cookie;
    let cookieArray = cookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookieName = cookieArray[i].split('=')[0];
      let cookieValue = cookieArray[i].split('=')[1];
      if (cookieName.trim() == name) {
        return cookieValue;
      }
    }
    return '';
  }

  initializeSessionId() {
    this.session_id = this.getCookie('session_id'); // Initialize the session_id variable
  }

  // Call the initializeSessionId method before making the fetch request
  fetchUserData() {
    this.initializeSessionId();
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
          userData['favoriten'] = await Promise.all(
            userData['favoriten'].map(async (shop: any) => await this.databaseSrv.getShop(shop))
          );
          console.log(userData);
          this.userSrv.setUser(data['user']);
        } else {
          this.userSrv.logout();
        }
      });
  }
}
