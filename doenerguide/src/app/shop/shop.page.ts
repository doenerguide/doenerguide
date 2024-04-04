import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Shop, ShopFunctions } from '../interfaces/shop';
import { environment } from 'src/environments/environment';
import { IonicModule } from '@ionic/angular';
import { PriceComponent } from '../price/price.component';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, PriceComponent],
})
export class ShopPage implements OnInit {
  @Input() id: string = '';

  shop: Shop | undefined;
  shopFunctions = ShopFunctions;

  constructor() { }

  ngOnInit() {
    this.shop = environment.shops.find((shop: Shop) => shop.id === this.id);
  }
}
