import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthInterface } from '../interfaces/auth-interface';
import { UserModel } from '../models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthInterface {
  // Registrar
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // Logear
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  private url = 'https://identitytoolkit.googleapis.com/v1';
  private apiKey = 'AIzaSyCmQCO4x4_PvUwBaImN6NkH86nk-hZb3o0';

  private userToken;

  constructor(private http: HttpClient) {}

  signup(user: UserModel) {
    const userData = {
      ...user,
      returnSecureToken: true
    };

    return this.http
      .post(`${this.url}/accounts:signUp?key=${this.apiKey}`, userData)
      .pipe(
        map(response => {
          this.setToken(response['idToken'], response['expiresIn']);
          return response;
        })
      );
  }
  login(user: UserModel) {
    const userData = {
      ...user,
      returnSecureToken: true
    };

    return this.http
      .post(
        `${this.url}/accounts:signInWithPassword?key=${this.apiKey}`,
        userData
      )
      .pipe(
        map(response => {
          this.setToken(response['idToken'], response['expiresIn']);
          return response;
        })
      );
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
  }

  private setToken(token: string, expiresIn: number) {
    this.userToken = token;
    localStorage.setItem('token', this.userToken);

    const expirationDate = new Date();
    expirationDate.setSeconds(expiresIn);

    localStorage.setItem('expiresIn', expirationDate.getTime().toString());
  }

  private getToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = null;
    }
  }

  public isAuthenticated(): boolean {
    if (!this.getToken) {
      return false;
    }

    const expiration = Number(localStorage.getItem('expiresIn'));
    const expirationDate = new Date();
    expirationDate.setTime(expiration);

    if (expirationDate > new Date()) {
      return true;
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('expiresIn');
      return false;
    }
  }
}
