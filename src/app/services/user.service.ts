import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../types/user';
import { environment } from '../../environments/environment.development';
import { HttpService } from './http.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private httpService: HttpService,
    private authService: AuthenticationService
  ) {}

  getData() {
    return this.httpService.get<HttpResponse<User>>({
      url: `${environment.BASE_URL}/users/getData`,
      headers: { authorization: this.authService.getToken() },
    });
  }

  generateNewToken() {
    return this.httpService.put({
      url: `${environment.BASE_URL}/users/generateNewToken`,
      headers: { authorization: this.authService.getToken() },
    });
  }

  updateData(name: string) {
    return this.httpService.put({
      url: `${environment.BASE_URL}/users/updateData`,
      headers: { authorization: this.authService.getToken() },
      body: { name },
    });
  }

  updatePassword(password: string) {
    return this.httpService.put({
      url: `${environment.BASE_URL}/users/updatePassword`,
      headers: { authorization: this.authService.getToken() },
      body: { password },
    });
  }

  deleteUser() {
    return this.httpService.delete({
      url: `${environment.BASE_URL}/users/deleteUser`,
      headers: { authorization: this.authService.getToken() },
    });
  }
}
