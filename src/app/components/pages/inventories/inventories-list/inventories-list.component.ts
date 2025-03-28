import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Inventory } from '../../../../types/inventory';
import { InventoryService } from '../../../../services/inventory.service';
import { ALERT_ICONS, getInputAlert, showMessageAlert } from '../../../../utils/alerts';
import { responseHandler } from '../../../../utils/responseHandler';
import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-inventories-list',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './inventories-list.component.html',
  styleUrl: './inventories-list.component.scss'
})
export class InventoriesListComponent {
  inventories: Inventory[] = [];

  constructor(
    private inventoryService: InventoryService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    inventoryService.getByUser()
    .subscribe(response => {
      if (response.ok) {
        this.inventories = response.body!;
      } else {
        responseHandler(response, router, authService);
      }
    });
  }

  goToInventory(inventory: Inventory) {
    this.router.navigateByUrl(`/inventories/${inventory.id}/schema`);
  }

  async createInventory() {
    const input = await getInputAlert(
      'Create inventory',
      'Write the name of the new inventory...'
    );
    const confirmed = input[0];
    const name = input[1];
    if (!confirmed) {
      return;
    }
    if (!name) {
      showMessageAlert(
        'Invalid name',
        'The name for the inventory can\'t be empty',
        ALERT_ICONS.ERROR
      );
      return;
    }
    this.inventoryService.create(name)
    .subscribe(response => {
      if (response.ok) {
        showMessageAlert(
          'Inventory created successfully',
          '',
          ALERT_ICONS.SUCCESS
        );
      } else {
        responseHandler(response, this.router, this.authService);
      }
    });
  }
}
