import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Inventory } from '../../../../types/inventory';
import { AuthenticationService } from '../../../../services/authentication.service';
import { InventoryService } from '../../../../services/inventory.service';
import { responseHandler } from '../../../../utils/responseHandler';

@Component({
  selector: 'app-inventory-settings',
  standalone: true,
  imports: [],
  templateUrl: './inventory-settings.component.html',
  styleUrl: './inventory-settings.component.scss'
})
export class InventorySettingsComponent {
  inventory = null as unknown as Inventory;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private inventoryService: InventoryService
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    inventoryService.getById(id, true)
    .subscribe(response => {
      if (response.ok) {
        this.inventory = response.body!;
      } else {
        responseHandler(response, router, authService);
      }
    });
  }
}
