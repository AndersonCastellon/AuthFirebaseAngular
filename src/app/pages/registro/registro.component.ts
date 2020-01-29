import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html'
})
export class RegistroComponent implements OnInit {
  public user: UserModel;
  public rememberMe = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = new UserModel();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      icon: 'info',
      title: 'Registrandote',
      text: 'Espere por favor...',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.auth.signup(this.user).subscribe(
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
          title: 'Error',
          text: err.error.error.message,
          allowOutsideClick: false
        });
      }
    );
  }
}
