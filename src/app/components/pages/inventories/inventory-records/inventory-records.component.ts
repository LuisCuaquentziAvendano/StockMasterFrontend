import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../../services/authentication.service';
import { InventoryService } from '../../../../services/inventory.service';
import { Inventory } from '../../../../types/inventory';
import { responseHandler } from '../../../../utils/responseHandler';
import { SaleService } from '../../../../services/sale.service';
import { SaleRecordService } from '../../../../services/sale-record.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../types/product';
import { Sale } from '../../../../types/sale';
import { ALERT_ICONS, showMessageAlert } from '../../../../utils/alerts';
import { SaleRecord } from '../../../../types/sale-record';
import { FormatAmountPipe } from '../../../../pipes/format-amount.pipe';

export interface Parameter {
  name: string;
  id: string;
}

@Component({
  selector: 'app-inventory-records',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormatAmountPipe],
  templateUrl: './inventory-records.component.html',
  styleUrl: './inventory-records.component.scss'
})
export class InventoryRecordsComponent {
  inventory = null as unknown as Inventory;
  sales: Sale[] = [];
  products: Product[] = [];
  saleRecords: SaleRecord[] = [];
  parameters: Parameter[] = [];
  creator = false;
  typeSelected = false;
  form!: FormGroup;
  param!: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private inventoryService: InventoryService,
    private saleService: SaleService,
    private saleRecordService: SaleRecordService,
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    inventoryService.getById(id, false)
    .subscribe(response => {
      if (response.ok) {
        this.inventory = response.body!;
      } else {
        responseHandler(response, router, authService);
      }
    });

    this.getSaleRecords();

    this.form = this.formBuilder.group({
      record: ['', Validators.required],
    });

    this.param = this.formBuilder.group({
      paramSelect: ['', Validators.required],
    })
  }

  private getProducts() {
    this.productService.getByQuery(this.inventory.id, ' ', 0).subscribe(response => {
        if (response.ok) {
            this.products = (response.body as any).products;
            this.products.forEach(element => {
                this.parameters.push({ name: element.fields['name'], id: element.id });
            });
        } else {
            responseHandler(response, this.router, this.authService);
        }
    });
  }

  private getSales() {
      this.saleService.getSales(this.inventory.id).subscribe(response => {
          if (response.ok) {
              this.sales = response.body!;
              this.sales.forEach(element => {
                  this.parameters.push({ name: element.customer, id: element.customer });
              });
          } else {
              responseHandler(response, this.router, this.authService);
          }
      });
  }

  private getSaleRecords() {
    this.saleRecordService.getAllSalesRecords(this.inventory.id).subscribe(response => {
      if (response.ok) {
        this.saleRecords = response.body!;
      } else {
        responseHandler(response, this.router, this.authService);
      }
    })
  }

  goToSection(_route: string) {
    const id = this.inventory.id;
    this.router.navigateByUrl(`/inventories/${id}/${_route}`);
  }

  isInvalidField(field: string) {
    return this.form.get(field)?.touched && this.form.get(field)?.invalid;
  }

  loadCreator() {
    this.creator = true;
  }

  cancelCreator() {
    this.form.reset();
    this.param.reset();
    this.form.get('record')?.enable();
    this.parameters = [];
    this.creator = false;
    this.typeSelected = false;
  }

  selectType() { 
    const recordType = this.form.value.record;
    this.typeSelected = true;
    this.form.get('record')?.disable();

    if (recordType === "inventory") {
      this.parameters.push({ name: this.inventory.name, id: this.inventory.id });
    } 
    if (recordType === "product") {
      this.getProducts(); 
    } 
    if (recordType === "customer") {
      this.getSales(); 
    }
  }

  async generateRecord() {
    const recordType = this.form.value.record;
    const recordId = this.param.value.paramSelect;

    this.saleRecordService.createSalesRecord(this.inventory.id, recordType, recordId).subscribe(async response => {
      if(response.ok){
        this.cancelCreator();
        this.getSaleRecords();
  
        await showMessageAlert(
          'Sale record created successfully',
          '',
          ALERT_ICONS.SUCCESS
        );
      } else {
        await showMessageAlert(
          'No sales for such parameter found',
          '',
          ALERT_ICONS.WARNING
        );
        this.cancelCreator();
      }
    });
  }

  updateRecord(recordId: string, type: string, typeId: string) {
    this.saleRecordService.updateSalesRecord(this.inventory.id, recordId, type, typeId).subscribe(response=> {
      if (response.ok) {
        this.getSaleRecords();
      } else {
        responseHandler(response, this.router, this.authService);
      }
    })
  }

  deleteRecord(recordId: string) {
    this.saleRecordService.deleteSalesRecord(this.inventory.id, recordId).subscribe(response=> {
      if (response.ok) {
        this.getSaleRecords();
      } else {
        responseHandler(response, this.router, this.authService);
      }
    })
  }
}
