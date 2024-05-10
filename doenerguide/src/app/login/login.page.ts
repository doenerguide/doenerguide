import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { environment } from 'src/environments/environment';
import { DatabaseService } from '../services/database.service';
import { User } from '../interfaces/user';
import { StorageService } from '../services/storage.service';

let endpoint = environment.endpoint;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
})
export class LoginPage implements OnInit {
  // Import components of the template page to be used in TypeScript
  @ViewChild('errorMessage', { read: ElementRef }) errorMessage!: ElementRef;

  // Definition of the login form
  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userSrv: UserService,
    private databaseSrv: DatabaseService,
    private storageSrv: StorageService
  ) {}

  // Called when the page is first loaded, checks if the user is already logged in
  ngOnInit() {
    if (this.userSrv.isLoggedIn()) {
      this.router.navigate(['/account']);
    }
  }

  /**
   * Handle the login of the user
   * @returns void
   */
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
      .then(async (data) => {
        if (data['success']) {
          let userData = data['user'];
          userData['favoriten'] = await Promise.all(userData['favoriten'].map(async (shop: any) => await this.databaseSrv.getShop(shop)));
          this.storageSrv.setSessionToken(data['session_id']);
          this.userSrv.setUser(userData as User);
          this.router.navigate(['/home', { message: 'Login erfolgreich' }]);
        } else {
          this.errorMessage.nativeElement.innerHTML = 'Falsche E-Mail oder falsches Passwort';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  /**
   * Check if the login button should be disabled
   * @returns boolean if the login button should be disabled
   */
  checkLoginButton(): boolean {
    return !this.form.valid;
  }
}
