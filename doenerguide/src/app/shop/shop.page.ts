import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Shop, ShopFunctions } from '../interfaces/shop';
import { IonicModule } from '@ionic/angular';
import { PriceComponent } from '../price/price.component';
import { DatabaseService } from '../services/database.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, PriceComponent],
})
export class ShopPage implements OnInit {
  shop: Shop | null = null;
  shopFunctions = ShopFunctions;

  public Object = Object;

  constructor(private route: ActivatedRoute, public userSrv: UserService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params);
      this.shop = JSON.parse(params['shop']) as Shop;
    });
  }
}
