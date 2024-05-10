import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, IonImg, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonLabel,
    IonImg,
    IonButtons,
    IonBackButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
})
export class CardPage implements OnInit {
  cardInformation!: { name: string; amount: number };

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.cardInformation = JSON.parse(params['stamps']);
    });
  }

  getImageForStamps(): string {
    return `assets/card/Stempelkarte_${this.cardInformation.amount}.png`;
  }

  back() {
    this.location.back();
  }
}
