import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ToastController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

let endpoint = environment.endpoint;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class SignupPage {
  @ViewChild('errorMessage', { read: ElementRef }) errorMessage!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
    vorname: ['', Validators.required],
    nachname: ['', Validators.required],
    terms: [false, Validators.requiredTrue],
  });

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

  register() {
    this.errorMessage.nativeElement.innerHTML = '';
    if (this.checkRegisterButton()) {
      return;
    }

    if (!this.form.valid) {
      this.errorMessage.nativeElement.innerHTML =
        'Bitte füllen alle Felder korrekt aus';
      return;
    }

    let password = this.form.get('password')?.value;
    let passwordConfirm = this.form.get('passwordConfirm')?.value;

    if (password !== passwordConfirm) {
      this.errorMessage.nativeElement.innerHTML =
        'Passwörter stimmen nicht überein';
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
          this.toastCtrl
            .create({
              message: 'Erfolgreich registriert',
              duration: 2000,
              position: 'top',
              color: 'success',
              icon: 'checkmark-circle-outline',
            })
            .then((toast) => toast.present());
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.errorMessage.nativeElement.innerHTML =
            'Diese E-Mail Adresse ist bereits registriert';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}
