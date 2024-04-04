import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Shop, ShopFunctions } from '../interfaces/shop';
import { environment } from 'src/environments/environment';
import { IonicModule } from '@ionic/angular';
import { PriceComponent } from '../price/price.component';
import { DatabaseService } from '../services/database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, PriceComponent],
})
export class ShopPage implements OnInit {
  //@Input() shop!: Shop;

  //shop: Shop | undefined;

  shop: Shop | null = null;
  shopFunctions = ShopFunctions;

  constructor(
    private databaseSrv: DatabaseService,
    private route: ActivatedRoute
  ) {}

  /*ngOnInit() {
    this.databaseSrv.getShop(this.id).then((shop) => (this.shop = shop));
  }*/

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params);
      this.shop = JSON.parse(params['shop']) as Shop;
    });
  }
}
