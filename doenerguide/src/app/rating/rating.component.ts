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
  // Import the rating from the parent component
  @Input() rating!: number;

  // List of stars to be displayed
  stars: number[] = [];
  // List of not rated stars to be displayed
  notRatedStars: number[] = [];

  // Called when the component is first loaded, will create a list of how many stars should be displayed
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
