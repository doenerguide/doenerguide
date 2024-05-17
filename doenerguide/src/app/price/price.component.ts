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
  // Import the price category from the parent component
  @Input() priceCategory!: number;

  // List of prices to be displayed
  priceList: number[] = [];

  // Called when the component is first loaded, will create a list of how often the price symbol should be displayed
  ngOnInit() {
    for (let i = 0; i < this.priceCategory; i++) {
      this.priceList.push(i);
    }
  }
}
