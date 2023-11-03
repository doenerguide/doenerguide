import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}


//add event listener on keypress
document.addEventListener('keydown', (event) => {
  loginButton(event);
});


function loginButton(event?: KeyboardEvent) {
  var email = document.getElementById('email') as HTMLInputElement;
  var password = document.getElementById('password') as HTMLInputElement;
  var loginbutton = document.getElementById('login') as HTMLButtonElement;
  if (email.value == "" || password.value == "") {
    loginbutton.disabled = true;
  } else {
    loginbutton.disabled = false;
    if (event?.keyCode == 13) {
      loginbutton.click();
    }
  }
}
