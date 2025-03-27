import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isAuthenticated = false;
  location = '/';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    authService._isAuthenticated.subscribe(value => {
      this.isAuthenticated = value;
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.location = event.url;
        console.log(this.location);
      }
    });
  }

  goToUrl() {
    if (this.isAuthenticated) {
      this.router.navigateByUrl('/inventories');
    } else {
      this.router.navigateByUrl('/');
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
