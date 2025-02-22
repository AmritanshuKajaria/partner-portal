import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiResponse } from '../model/common.model';

const TOKEN_HEADER_KEY = 'x-access-token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private authService: AuthService,
    private message: NzMessageService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    let authReq = req;
    const token = this.authService.getAccessToken();
    if (
      token != null &&
      !authReq.url.includes('api.ipify.org') &&
      !authReq.url.includes('generate_zendesk_token')
    ) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !authReq.url.includes('refresh-token')
        ) {
          return this.handle401Error(authReq, next, error);
        }
        return this.handleOtherErrors(error);
      })
    );
  }

  private handleOtherErrors(error: any) {
    let errorMessage = '';

    // If client has internet connectivity
    if (!navigator.onLine) {
      errorMessage = 'No internet. Please check your connection.';
    } else if (error.status === 0) {
      errorMessage = 'Request blocked. Contact support.';
    } else if (error.status > 500) {
      errorMessage = 'Request timed out. Try again later.';
    } else if (error.status === 404) {
      errorMessage = 'Not a valid request';
    }

    if (errorMessage) {
      this.message.error(errorMessage);
      // To show only one error message added this
      return throwError(() => ({ error_shown: true }));
    }
    return throwError(() => error);
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
    error: any
  ) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = this.authService.getRefreshToken();
      if (token)
        return this.authService.refreshToken({ refresh_token: token }).pipe(
          switchMap((result: ApiResponse) => {
            const res: any = result?.response ?? {};
            this.isRefreshing = false;
            this.authService.setAccessToken(res.access_token);
            this.refreshTokenSubject.next(res.access_token);

            return next.handle(this.addTokenHeader(request, res.access_token));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            // this.authService.logout();
            this.authService.clearToken();
            return (window.location.href = '/auth/login');
          })
        );
      else {
        this.isRefreshing = false;
        this.authService.clearToken();
        return (window.location.href = '/auth/login');
      }
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addTokenHeader(request, token)))
      );
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    /* for Spring Boot back-end */
    if (
      request.url.includes('refresh-token') &&
      request.url.includes('login') &&
      request.url.includes('reset-password')
    ) {
      return request.clone({
        headers: new HttpHeaders(),
      });
    } else {
      const token = this.authService.getAccessToken();
      return request.clone({
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      });
    }
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
