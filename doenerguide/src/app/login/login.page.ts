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
import { UserService } from '../services/user.service';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

let endpoint = environment.endpoint;

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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userSrv: UserService
  ) {}

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
          let user = data['user'] as User;
          this.setCookie('session_id', data['session_id'], 365);
          this.userSrv.setUser(user);
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

  // set cookie function
  setCookie(name: string, value: string, days: number) {
    let expires = '';
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  }

  checkLoginButton(): boolean {
    return !this.form.valid;
  }
}
