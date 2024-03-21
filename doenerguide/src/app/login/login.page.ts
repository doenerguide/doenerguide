import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import * as $ from 'jquery';

// let endpoint = "https://doenerguide.onrender.com";
let endpoint = 'http://127.0.0.1:5050';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
})
export class LoginPage {
  @ViewChild('errorMessage', { read: ElementRef }) errorMessage!: ElementRef;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  handleLogin() {
    if (!this.form.valid) {
      return;
    }

    fetch(endpoint + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(this.form.value),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data['success']) {
          this.router.navigate(['/home', { message: 'Login erfolgreich' }]);
        } else {
          this.errorMessage.nativeElement.innerHTML =
            'Falsche E-Mail oder falsches Passwort';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  checkLoginButton(): boolean {
    return !this.form.valid;
  }

  //function calles when continue as guest button is clicked
  guest() {
    console.log('guest');
  }
}
