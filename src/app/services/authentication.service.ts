import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment.development';

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

  login(email: string, password: string) {
    return this.httpService.post<HttpResponse<LoginResponse>>({
      url: `${environment.BASE_URL}/users/login`,
      body: { email, password, },
    }).pipe(map(response => {
        if (response.ok) {
          this.setToken(response.body?.authorization as string);
        }
        return response;
    }));
  }

  googleAuthUrl() {
    return `${environment.BASE_URL}/users/googleAuth`;
  }

  logout() {
    this._isAuthenticated.next(false);
    this.setToken('');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getToken() {
    return localStorage.getItem('authorization') as string;
  }

  private setToken(authorization: string) {
    this._isAuthenticated.next(true);
    localStorage.setItem('authorization', `Bearer ${authorization}`);
  }
}

interface LoginResponse {
  authorization: string;
}
