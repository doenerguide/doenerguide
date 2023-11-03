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
      login();
    }
  }
}


//function called when login button is clicked
function login() {
  console.log("login");
  //get email & password from input fields
  var email = document.getElementById('email') as HTMLInputElement;
  var password = document.getElementById('password') as HTMLInputElement;
  var email_value = email.value
  var password_value = password.value

  //connection to backend

  //if login is successful switch to home page
}


//function called when signup button is clicked
function signup() {
  //switch to signup page
}


//function calles when continue as guest button is clicked
function guest() {
  //switch to home page
}