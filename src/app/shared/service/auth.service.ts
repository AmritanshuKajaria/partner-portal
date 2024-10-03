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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = environment.apiUrl;

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

  clearToken() {
    localStorage.clear();
  }

  getAccessToken() {
    // return localStorage.getItem(TOKEN_KEY);
    return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIxMjNTdG9yZXMiLCJhdWQiOiJQYXJ0bmVyUG9ydGFsIiwiaWF0IjoxNzI3OTQ4MjE0LCJleHAiOjE3Mjc5Njk4MTQsImRhdGEiOnsiZW1haWwiOiJrYXJhbi50YXVyYW5pQDEyM3N0b3Jlcy5jb20ifX0.oLacKdpzCRKVelym4tMhSd7daq7mag9OoiQcRXGTZyQ'
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
    this.router.navigate(['']);
  }

  logout() {
    return this.httpClient.post(this.url + '/logout', {});
  }
}
