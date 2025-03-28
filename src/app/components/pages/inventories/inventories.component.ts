import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';

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

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.location = event.url;
        this.showSubheader = event.url != '/inventories';
      }
    });
  }

  goToSection(_route: string) {
    const url = this.location.split('/');
    const id = url[url.length-2];
    this.router.navigateByUrl(`/inventories/${id}/${_route}`);
  }
}
