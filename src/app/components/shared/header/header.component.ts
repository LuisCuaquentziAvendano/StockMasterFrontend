import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgClass, MatIconModule],
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
