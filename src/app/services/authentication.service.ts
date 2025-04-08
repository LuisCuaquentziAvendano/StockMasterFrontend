import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment.development';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  _isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private httpService: HttpService) {}

  register(name: string, email: string, password: string) {
    return this.httpService.post({
      url: `${environment.BASE_URL}/users/register`,
      body: { name, email, password },
    });
  }

  login(email?: string, password?: string): Observable<HttpResponse<LoginResponse>> {
    return this.httpService.post<HttpResponse<LoginResponse>>({
      url: `${environment.BASE_URL}/users/login`,
      body: { email, password, },
    }).pipe(map(response => {
        if (response.ok) {
          this.setToken(response.body?.authorization!);
          this._isAuthenticated.next(true);
        }
        return response;
    }));
  }

  googleAuthUrl() {
    return `${environment.BASE_URL}/users/googleAuth`;
  }

  checkAuthorizationUrl(route: ActivatedRouteSnapshot) {
    if (this.isAuthenticated()) {
      return;
    }
    const authorization = route.queryParams['authorization'];
    if (authorization) {
      this.setToken(authorization);
      this._isAuthenticated.next(true);
    }
  }

  logout() {
    this._isAuthenticated.next(false);
    this.setToken('');
  }

  isAuthenticated() {
    const isAuth = !!this.getToken();
    this._isAuthenticated.next(isAuth);
    return isAuth;
  }

  getToken() {
    return localStorage.getItem('authorization') || '';
  }

  private setToken(authorization: string) {
    localStorage.setItem('authorization', authorization ? `Bearer ${authorization}` : '');
  }

  getRedirectUrl() {
    const redirectTo = sessionStorage.getItem('redirectTo') || '';
    this.setRedirectUrl('');
    return redirectTo;
  }

  setRedirectUrl(redirectTo: string) {
    sessionStorage.setItem('redirectTo', redirectTo);
  }
}

interface LoginResponse {
  authorization: string;
}
