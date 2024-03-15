import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class PriceComponent implements OnInit {
  @Input() priceCategory!: number;

  priceList: number[] = [];

  ngOnInit() {
    for (let i = 0; i < this.priceCategory; i++) {
      this.priceList.push(i);
    }
  }
}
