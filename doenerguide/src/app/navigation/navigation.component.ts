import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  standalone: true,
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  imports: [IonicModule],
})
export class NavigationComponent{
  tab = 'login';
  constructor(private userSrv: UserService) {}

  ngOnInit() {
    this.reloadTab();
  }

  reloadTab() {
    if (this.userSrv.isLoggedIn()) {
      if (this.userSrv.getDoenerladenID() == null) {
        this.tab = 'account';
      } else {
        this.tab = 'doeneraccount';
      }
    } else {
      this.tab = 'login';
    }
  }


  
  
}
