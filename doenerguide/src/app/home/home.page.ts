import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NavigationComponent } from '../navigation/navigation.component';
import { Shop } from '../interfaces/shop';
import { RatingComponent } from '../rating/rating.component';
import { CommonModule } from '@angular/common';
import { PriceComponent } from '../price/price.component';
import { Flags, IFlags, getPrettyPrint } from '../interfaces/flags';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NavigationComponent,
    RatingComponent,
    CommonModule,
    PriceComponent,
  ],
})
export class HomePage implements OnInit {
  shownShops: Shop[] = [];

  ngOnInit() {
    this.shownShops = [
      {
        imageUrl: 'assets/img/doener.jpg',
        name: 'Döner 123',
        address: 'Straße 1, 12345 Musterstadt',
        rating: 4.5,
        priceCategory: 2,
        flags: {
          acceptCard: true,
          stampCard: true,
        },
        openingHours: {
          opens: '10:00',
          closes: '22:00',
        },
      },
      {
        imageUrl: 'assets/img/doener.jpg',
        name: 'Döner Jetzt',
        address: 'Straße 2, 12345 Musterstadt',
        rating: 2.5,
        priceCategory: 1,
        flags: {
          acceptCard: true,
          stampCard: false,
        },
        openingHours: {
          opens: '11:00',
          closes: '23:00',
        },
      },
      {
        imageUrl: 'assets/img/doener.jpg',
        name: 'Döner Imbiss',
        address: 'Straße 3, 12345 Musterstadt',
        rating: 2,
        priceCategory: 3,
        flags: {
          acceptCard: false,
          stampCard: false,
        },
        openingHours: {
          opens: '09:00',
          closes: '21:00',
        },
      },
    ];
  }

  checkOpeningColor(shop: Shop) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let nowTime = hours + ':' + minutes;
    if (
      nowTime > shop.openingHours.opens &&
      nowTime < shop.openingHours.closes
    ) {
      nowTime = hours + 1 + ':' + minutes;
      if (nowTime >= shop.openingHours.closes) {
        return 'warning';
      }
      return 'open';
    } else {
      return 'danger';
    }
  }

  enabledFlags(flags: Flags) {
    let iFlags = flags as unknown as IFlags;
    let enabledFlags: string[] = [];
    for (let flag in flags) {
      if (iFlags[flag]) {
        enabledFlags.push(getPrettyPrint(flag));
      }
    }
    return enabledFlags;
  }

  disabledFlags(flags: Flags) {
    let iFlags = flags as unknown as IFlags;
    let disabledFlags: string[] = [];
    for (let flag in flags) {
      if (!iFlags[flag]) {
        disabledFlags.push(getPrettyPrint(flag));
      }
    }
    return disabledFlags;
  }
}
