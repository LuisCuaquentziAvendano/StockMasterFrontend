import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Inventory } from '../../../../types/inventory';
import { AuthenticationService } from '../../../../services/authentication.service';
import { InventoryService } from '../../../../services/inventory.service';
import { responseHandler } from '../../../../utils/responseHandler';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ALERT_COLORS, ALERT_ICONS, requestConfirmationAlert, showMessageAlert } from '../../../../utils/alerts';

@Component({
  selector: 'app-inventory-schema',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './inventory-schema.component.html',
  styleUrl: './inventory-schema.component.scss'
})
export class InventorySchemaComponent {
  inventory = null as unknown as Inventory;
  editing: string | null = null;
  inventoryId: string = '';
  fieldBeingEdited: { original: string, new: string, visible: boolean } = {
    original: '',
    new: '',
    visible: false
  };
  showAddFieldForm: boolean = false;
  newField = {
    field: '',
    type: 'string',
    visible: true
  };
  typeOptions = ['string', 'number', 'float', 'boolean', 'array', 'object', 'date'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private inventoryService: InventoryService
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    inventoryService.getById(id, false)
    .subscribe(response => {
      if (response.ok) {
        this.inventory = response.body!;
        this.inventoryId = this.inventory.id;
      } else {
        responseHandler(response, router, authService);
      }
    });
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

  editField(field: string, visible: boolean): void {
    this.showAddFieldForm = false;
    
    this.editing = field;
    this.fieldBeingEdited = {
      original: field,
      new: field,
      visible: visible
    };
  }

  cancelEdit(): void {
    this.editing = null;
  }

  updateField(): void {
    if (!this.editing || !this.inventoryId) return;

    this.inventoryService.updateField(
      this.inventoryId,
      {
        field: this.fieldBeingEdited.original,
        newName: this.fieldBeingEdited.new,
        visible: this.fieldBeingEdited.visible
      }
    ).subscribe(() => {
      this.getInventory();
      this.editing = null;
    });
  }

  deleteField(field: string): void {
    requestConfirmationAlert(
      'Are you sure?',
      `Do you really want to delete the field "${field}"?`,
      ALERT_ICONS.WARNING,
      ALERT_COLORS.DANGER_DARK,
      'Yes, delete it'
    ).then((confirmed) => {
      if (!confirmed) return;

      this.inventoryService.deleteField(this.inventoryId, field).subscribe(() => {
        this.getInventory();
      });
    });
  }

  getFieldNames(): string[] {
    if (!this.inventory || !this.inventory.fields) return [];
    return Object.keys(this.inventory.fields);
  }

  getFieldType(field: string): string {
    if (!this.inventory || !this.inventory.fields) return '';
    return this.inventory.fields[field]?.type || '';
  }

  isFieldVisible(field: string): boolean {
    if (!this.inventory || !this.inventory.fields) return false;
    return this.inventory.fields[field]?.visible || false;
  }

  toggleAddFieldForm(): void {
    this.editing = null;
    
    this.showAddFieldForm = !this.showAddFieldForm;
    
    if (!this.showAddFieldForm) {
      this.resetNewFieldForm();
    }
  }

  resetNewFieldForm(): void {
    this.newField = {
      field: '',
      type: 'string',
      visible: true
    };
  }

  createField(): void {
    if (!this.newField.field.trim()) {
      alert('El nombre del campo es obligatorio');
      return;
    }

    this.inventoryService.createField(
      this.inventoryId,
      [this.newField]
    ).subscribe(async response => {
      if(response.ok){
        this.getInventory();
        this.showAddFieldForm = false;
        this.resetNewFieldForm();
        await showMessageAlert(
          'Field created successfully',
          '',
          ALERT_ICONS.SUCCESS
        );
      } else {
        responseHandler(response, this.router, this.authService);
      }
    });
  }
}
