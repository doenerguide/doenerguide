import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-stempelkarten',
  templateUrl: './stempelkarten.page.html',
  styleUrls: ['./stempelkarten.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class StempelkartenPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
