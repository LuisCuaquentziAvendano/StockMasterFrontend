import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { ROLES } from '../../../utils/roles';
import { responseHandler } from '../../../utils/responseHandler';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-inventories',
  standalone: true,
  imports: [RouterOutlet, NgClass],
  templateUrl: './inventories.component.html',
  styleUrl: './inventories.component.scss'
})
export class InventoriesComponent {
  showSubheader = false;
  location = '';
  showSalesLink = false;
  showSettingsLink = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private inventoryService: InventoryService
  ) {
    this.router.events.subscribe(event => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      this.showSubheader = false;
      if (!event.url.startsWith('/inventories') || event.url == '/inventories') {
        return;
      }
      this.location = event.url;
      const id = this.getInventoryId();
      this.inventoryService.getById(id, false)
      .subscribe(response => {
        if (response.ok) {
          this.showSalesLink = [ROLES.ADMIN, ROLES.STOCK].includes(response.body?.myRole!);
          this.showSettingsLink = [ROLES.ADMIN].includes(response.body?.myRole!);
          this.showSubheader = true;
        } else {
          responseHandler(response, router, authService);
        }
      });
    });
  }

  private getInventoryId() {
    const url = this.location.split('/');
    return url[url.length-2];
  }

  goToSection(_route: string) {
    const id = this.getInventoryId();
    this.router.navigateByUrl(`/inventories/${id}/${_route}`);
  }
}
