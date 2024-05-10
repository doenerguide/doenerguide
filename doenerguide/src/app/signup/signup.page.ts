import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';

let endpoint = environment.endpoint;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['../login/login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class SignupPage implements OnInit {
  // Import components of the template page to be used in TypeScript
  @ViewChild('errorMessage', { read: ElementRef }) errorMessage!: ElementRef;

  // Definition of the signup form
  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
    vorname: ['', Validators.required],
    nachname: ['', Validators.required],
    terms: [false, Validators.requiredTrue],
  });

  constructor(private formBuilder: FormBuilder, private router: Router, private userSrv: UserService) {}

  // Called when the page is first loaded, checks if the user is already logged in
  ngOnInit() {
    if (this.userSrv.isLoggedIn()) {
      this.router.navigate(['/account']);
    }
  }

  /**
   * Check if the register button should be disabled
   * @returns True if the button should be disabled
   */
  checkRegisterButton(): boolean {
    return !(
      this.form.get('email')?.valid &&
      this.form.get('password')?.valid &&
      this.form.get('passwordConfirm')?.valid &&
      this.form.get('vorname')?.valid &&
      this.form.get('nachname')?.valid &&
      this.form.get('terms')?.valid
    );
  }

  /**
   * Handle the registration of the user
   * @returns void, but will navigate to the home page if successful
   */
  register() {
    this.errorMessage.nativeElement.innerHTML = '';
    if (this.checkRegisterButton()) {
      return;
    }

    if (!this.form.valid) {
      this.errorMessage.nativeElement.innerHTML = 'Bitte füllen alle Felder korrekt aus';
      return;
    }

    let password = this.form.get('password')?.value;
    let passwordConfirm = this.form.get('passwordConfirm')?.value;

    if (password !== passwordConfirm) {
      this.errorMessage.nativeElement.innerHTML = 'Passwörter stimmen nicht überein';
      return;
    }

    let email = this.form.get('email')?.value;
    let vorname = this.form.get('vorname')?.value;
    let nachname = this.form.get('nachname')?.value;

    fetch(endpoint + '/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        vorname: vorname,
        nachname: nachname,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          let user = data['user'] as User;
          this.setCookie('session_id', data['session_id'], 365);
          this.userSrv.setUser(user);
          this.router.navigate(['/home', { message: 'Erfolgreich registriert' }]);
        } else {
          this.errorMessage.nativeElement.innerHTML = 'Diese E-Mail Adresse ist bereits registriert';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  /**
   * Set a cookie
   * @param name Name of the cookie
   * @param value Value of the cookie
   * @param days Days until the cookie expires
   */
  setCookie(name: string, value: string, days: number) {
    let expires = '';
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  }
}
