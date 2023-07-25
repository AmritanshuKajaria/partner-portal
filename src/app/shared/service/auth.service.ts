import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ChangePassword,
  ForgotPasswordReq,
  LoginReq,
  RefreshToken,
  ResetPasswordReq,
} from '../model/auth.model';
import { Route, Router } from '@angular/router';

const TOKEN_KEY = 'access_token';
const REFRESHTOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_profile';
const MODE_KEY = 'mode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  mode = localStorage.getItem('mode');
  url = this.mode === 'live' ? environment.prodUrl : environment.baseUrl;

  constructor(private httpClient: HttpClient, private router: Router) {
    console.log(this.url);
  }

  login(payload: LoginReq) {
    return this.httpClient.post(this.url + '/login', payload);
  }

  masterLogin(payload: LoginReq) {
    return this.httpClient.post(this.url + '/masterlogin', payload);
  }

  setAccessToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  setMode() {
    localStorage.setItem(MODE_KEY, 'temp');
    // live
  }

  clearToken() {
    localStorage.clear();
    this.setMode();
  }

  getAccessToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  setRefreshToken(token: string) {
    localStorage.setItem(REFRESHTOKEN_KEY, token);
  }

  getRefreshToken() {
    return localStorage.getItem(REFRESHTOKEN_KEY);
  }

  saveUser(user: any) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem(USER_KEY)
      ? JSON.parse(localStorage.getItem(USER_KEY)!)
      : null;
    return user;
  }

  resetPassword(payload: ResetPasswordReq) {
    return this.httpClient.post(this.url + '/reset-password', payload);
  }

  forgotPassword(payload: ForgotPasswordReq) {
    return this.httpClient.post(this.url + '/forgot-password', payload);
  }

  // changePasswordToken(payload: ChangePasswordToken) {
  //   return this.httpClient.post(this.url + '/change-password-token', payload);
  // }

  changePassword(payload: ChangePassword) {
    return this.httpClient.post(this.url + '/change-password', payload);
  }

  refreshToken(payload: RefreshToken) {
    return this.httpClient.post(this.url + '/refresh-token', payload);
  }

  logOutUser() {
    this.httpClient.post(this.url + '/logout', '');
    localStorage.clear();
    this.setMode();
    this.router.navigate(['']);
  }

  logout() {
    return this.httpClient.post(this.url + '/logout', {});
  }
}
