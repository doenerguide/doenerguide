import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { RatingComponent } from '../rating/rating.component';
import { IonicModule } from '@ionic/angular';
import { ShopFunctions } from '../interfaces/shop';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RatingComponent, RouterModule],
})
export class FavoritesPage {
  shopFunctions = ShopFunctions;
  constructor(public userSrv: UserService) {}
}
