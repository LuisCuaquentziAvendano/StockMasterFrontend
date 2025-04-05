import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Inventory } from '../../../../types/inventory';
import { AuthenticationService } from '../../../../services/authentication.service';
import { InventoryService } from '../../../../services/inventory.service';
import { responseHandler } from '../../../../utils/responseHandler';
import { MatIconModule } from '@angular/material/icon';
import { ALERT_COLORS, ALERT_ICONS, getInputAlert, requestConfirmationAlert, showMessageAlert } from '../../../../utils/alerts';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../types/user';
import { ROLES } from '../../../../utils/roles';

@Component({
  selector: 'app-inventory-settings',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  templateUrl: './inventory-settings.component.html',
  styleUrl: './inventory-settings.component.scss'
})
export class InventorySettingsComponent {
  inventory = null as unknown as Inventory;
  addingPermission = false;
  addPermissionEmail = '';
  addPermissionRole = ROLES.QUERY;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private inventoryService: InventoryService
  ) {
    this.getInventory();
  }

  getInventory() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.inventoryService.getById(id, true)
    .subscribe(response => {
      if (response.ok) {
        this.inventory = response.body!;
      } else {
        responseHandler(response, this.router, this.authService);
      }
    });
  }

  async editName() {
    const [confirmed, name] = await getInputAlert(
      'Edit name',
      'Write the new name to this inventory',
    );
    if (!confirmed) {
      return;
    }
    this.inventoryService.updateData(this.inventory.id, name)
    .subscribe(response => {
      if (response.ok) {
        this.getInventory();
      } else {
        responseHandler(response, this.router, this.authService);
      }
    });
  }

  changeAddingPermission() {
    this.addingPermission = !this.addingPermission;
  }

  async addPermission() {
    if (!this.addPermissionEmail) {
      await showMessageAlert(
        'Email is required',
        undefined,
        ALERT_ICONS.ERROR,
      );
      return;
    }
    this.inventoryService.modifyPermission(this.inventory.id, this.addPermissionEmail, this.addPermissionRole)
    .subscribe(async response => {
      if (response.ok) {
        await showMessageAlert(
          'Permission created',
          undefined,
          ALERT_ICONS.SUCCESS,
        );
        this.getInventory();
      } else {
        responseHandler(response, this.router, this.authService);
      }
    });
    this.changeAddingPermission();
  }

  async deletePermission(user: User) {
    const confirmed = await requestConfirmationAlert(
      'Delete permission',
      'If you delete this permission, the user will no longer be able to access to this inventory.',
      ALERT_ICONS.WARNING,
      ALERT_COLORS.DANGER_DARK,
      'Delete',
    );
    if (!confirmed) {
      return;
    }
    this.inventoryService.modifyPermission(this.inventory.id, user.email, ROLES.NONE)
    .subscribe(async response => {
      if (response.ok) {
        await showMessageAlert(
          'Permission deleted',
          undefined,
          ALERT_ICONS.SUCCESS,
        );
        this.getInventory();
      } else {
        responseHandler(response, this.router, this.authService);
      }
    });
  }

  async deleteInventory() {
    const confirmed = await requestConfirmationAlert(
      'Delete all',
      'If you delete the inventory, all data related will be deleted, included the schema, products, sales and sales records for you and all users with permissions in this inventory.',
      ALERT_ICONS.WARNING,
      ALERT_COLORS.DANGER_DARK,
      'Delete all',
    );
    if (!confirmed) {
      return;
    }
    this.inventoryService.deleteInventory(this.inventory.id)
    .subscribe(response => {
      if (response.ok) {
        this.router.navigateByUrl('/inventories');
      } else {
        responseHandler(response, this.router, this.authService);
      }
    });
  }
}
