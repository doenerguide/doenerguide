import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import * as $ from 'jquery';

let endpoint = "https://doenerguide.onrender.com";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class SignupPage implements OnInit {

  constructor() { }

  //function called when signup button is clicked
  signup() {
    let vorname_elem = document.getElementById('vorname') as HTMLInputElement;
    let nachname_elem = document.getElementById('nachname') as HTMLInputElement;
    let email_elem = document.getElementById('email') as HTMLInputElement;
    let password_elem = document.getElementById('password') as HTMLInputElement;
    let password_confirm_elem = document.getElementById('password_confirm') as HTMLInputElement;

    let vorname_value = vorname_elem.value;
    let nachname_value = nachname_elem.value;
    let email_value = email_elem.value;
    let password_value = password_elem.value;
    let password_confirm_value = password_confirm_elem.value;

    if (password_value != password_confirm_value) {
      let error_message = document.getElementById('error_message');
      if (error_message) {
        error_message.innerHTML = 'Passwörter stimmen nicht überein';
      }
      return;
    }

    if (password_value.length < 8) {
      let error_message = document.getElementById('error_message');
      if (error_message) {
        error_message.innerHTML = 'Passwort muss mindestens 8 Zeichen lang sein';
      }
      return;
    }

    if (password_value.length > 20) {
      let error_message = document.getElementById('error_message');
      if (error_message) {
        error_message.innerHTML = 'Passwort darf maximal 20 Zeichen lang sein';
      }
      return;
    }

    let regex_mail = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$');
    if (!regex_mail.test(email_value)) {
      let error_message = document.getElementById('error_message');
      if (error_message) {
        error_message.innerHTML = 'Bitte gib eine gültige E-Mail Adresse ein';
      }
      return;
    }

    $.ajax({
      url: endpoint + '/get_user',
      type: 'POST',
      data: JSON.stringify({ "email": email_value }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      success: function (data: any) {
        if (data["success"]) {
          let error_message = document.getElementById('error_message');
          if (error_message) {
            error_message.innerHTML = 'E-Mail Adresse wird bereits verwendet';
          }
          return;
        }
      },
      error: function (xhr: any, status: string, error: any) {
        console.log(xhr.responseText);
        console.log(status);
        console.log(error);
        return;
      }
    });

    // ajax request to endpoint /signup with body {vorname: vorname_value, nachname: nachname_value, email: email_value, password: password_value, password_confirm: password_confirm_value}
    $.ajax({
      url: endpoint + '/signup',
      type: 'POST',
      data: JSON.stringify({ "vorname": vorname_value, "nachname": nachname_value, "email": email_value, "password": password_value, "password_confirm": password_confirm_value }),
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
            error_message.innerHTML = 'Es ist ein Fehler aufgetreten';
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

  signupButton() {
    let vorname = document.getElementById('vorname') as HTMLInputElement;
    let nachname = document.getElementById('nachname') as HTMLInputElement;
    let email = document.getElementById('email') as HTMLInputElement;
    let password = document.getElementById('password') as HTMLInputElement;
    let password_confirm = document.getElementById('password_confirm') as HTMLInputElement;
    let signupbutton = document.getElementById('signup') as HTMLButtonElement;
    let terms = document.getElementById('terms') as HTMLInputElement;
    if (!terms.checked) {
      signupbutton.disabled = true;
      return false;
    }
    if (vorname.value == "") {
      signupbutton.disabled = true;
      return false;
    }
    if (nachname.value == "") {
      signupbutton.disabled = true;
      return false;
    }
    if (email.value == "") {
      signupbutton.disabled = true;
      return false;
    }
    if (password.value == "") {
      signupbutton.disabled = true;
      return false;
    }
    if (password_confirm.value == "") {
      signupbutton.disabled = true;
      return false;
    }
    signupbutton.disabled = false;
    return true;
  }

  ngOnInit() { }

}


document.addEventListener('keyup', (event) => {
  let isEnabled = SignupPage.prototype.signupButton();
  if (event.key === 'Enter' && isEnabled) {
    SignupPage.prototype.signup();
  }
});
