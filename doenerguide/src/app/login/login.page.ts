import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import * as $ from 'jquery';

let endpoint = "https://doenerguide.onrender.com";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class LoginPage implements OnInit {
  constructor() { }

  ngOnInit() { }
}

//add event listener on keypress
document.addEventListener('keydown', (event) => {
  loginButton(event);
});

//function called when login button is clicked
function login() {
  console.log('login');
  //get email & password from input fields
  let email = document.getElementById('email') as HTMLInputElement;
  let password = document.getElementById('password') as HTMLInputElement;
  let email_value = email.value;
  let password_value = password.value;

  // ajax request to endpoint /login with body {email: email_value, password: password_value}
  $.ajax({
    url: endpoint + '/login',
    type: 'POST',
    data: JSON.stringify({ email: email_value, password: password_value }),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    headers: {
        "Access-Control-Allow-Origin": "*"
    },
    success: function (data: any) {
      if (data["success"]) {
        window.location.href = '/home';
      } else {
        //if login is not successful show error message
        let error_message = document.getElementById('error_message');
        if (error_message) {
          error_message.innerHTML = 'Falsche E-Mail oder falsches Passwort';
        }
      }
    },
    error: function (xhr: any, status: string, error: any) {
      console.log(xhr.responseText);
      console.log(status);
      console.log(error);
    },
  });
}


function loginButton(event?: KeyboardEvent) {
  let email = document.getElementById('email') as HTMLInputElement;
  let password = document.getElementById('password') as HTMLInputElement;
  let loginbutton = document.getElementById('login') as HTMLButtonElement;
  if (email.value == '' || password.value == '') {
    loginbutton.disabled = true;
  } else {
    loginbutton.disabled = false;
    if (event?.keyCode == 13) {
      login();
    }
  }
}

//function calles when continue as guest button is clicked
function guest() {
  //login with guest account
}
