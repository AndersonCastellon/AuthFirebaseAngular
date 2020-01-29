import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  public user: UserModel = new UserModel();
  public rememberMe = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('email')) {
      this.user.email = localStorage.getItem('email');
      this.rememberMe = true;
    }
  }

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Autenticando',
      text: 'Espere por favor'
    });
    Swal.showLoading();

    this.auth.login(this.user).subscribe(
      response => {
        console.log(response);
        Swal.close();

        if (this.rememberMe) {
          localStorage.setItem('email', this.user.email);
        }

        this.router.navigateByUrl('/home');
      },
      err => {
        console.log(err.error.error.message);
        Swal.fire({
          icon: 'error',
          title: 'error',
          text: 'Credenciales incorrectas'
        });
      }
    );
  }
}
