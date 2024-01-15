import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Register } from '../interfaces/register';
import { Login } from '../interfaces/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userPayload: any;
  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = this.decodeToken();
  }
  private baseUrl: string = 'https://localhost:7030/api/account/';

  signUp(signupObject: Register) {
    return this.http.post<any>(`${this.baseUrl}register`, signupObject);
  }

  login(loginObject: Login) {
    return this.http.post<any>(`${this.baseUrl}login`, loginObject);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  decodeToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }

  getNameFromToken() {
    if (this.userPayload) {
      return this.userPayload.Name;
    }
  }

  getIdFromToken() {
    if (this.userPayload) {
      return this.userPayload.Id;
    }
  }

  getRoleFromToken() {
    if (this.userPayload) {
      return this.userPayload.Role;
    }
  }
}
