import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-rating',
  standalone: true,
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class RatingComponent implements OnInit {
  @Input() rating!: number;

  stars: number[] = [];
  notRatedStars: number[] = [];

  ngOnInit() {
    this.rating = Math.round(this.rating);
    for (let i = 0; i < this.rating; i++) {
      this.stars.push(i);
    }
    for (let i = this.rating; i < 5; i++) {
      this.notRatedStars.push(i);
    }
  }
}
