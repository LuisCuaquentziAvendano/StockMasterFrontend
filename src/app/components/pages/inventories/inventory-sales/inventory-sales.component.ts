import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Inventory } from '../../../../types/inventory';
import { AuthenticationService } from '../../../../services/authentication.service';
import { InventoryService } from '../../../../services/inventory.service';
import { responseHandler } from '../../../../utils/responseHandler';
import { Sale } from '../../../../types/sale';
import { SaleService } from '../../../../services/sale.service';
import { FormatAmountPipe } from '../../../../pipes/format-amount.pipe';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../types/product';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ALERT_ICONS, showMessageAlert } from '../../../../utils/alerts';
import { MatIconModule } from '@angular/material/icon';

export interface CartElement {
  product_id: string;
  name: string;
  price: string;
  amount: string;
}

export interface ProductElement {
  product_id: string;
  price: string;
  amount: string;
}

@Component({
  selector: 'app-inventory-sales',
  standalone: true,
  imports: [FormatAmountPipe, ReactiveFormsModule, CommonModule, RouterLink, MatIconModule],
  templateUrl: './inventory-sales.component.html',
  styleUrl: './inventory-sales.component.scss'
})

export class InventorySalesComponent {
  inventory = null as unknown as Inventory;
  sales: Sale[] = [];
  products: Product[] = [];
  cart: CartElement[] = []
  saleCreator = false;
  cartEmpty = true;
  form!: FormGroup;
  upload!: FormGroup;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private inventoryService: InventoryService,
    private saleService: SaleService,
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
    this.getSales();
    this.form = this.formBuilder.group({
      products: ['', Validators.required],
      amount: [
        '', 
        [Validators.required, Validators.min(1)]
      ]
    });

    this.upload = this.formBuilder.group({
      customer: ['', [Validators.required, Validators.email]] 
    });
  }

  private getSales() {
    this.saleService.getSales(this.inventory.id).subscribe(response => {
      if (response.ok) {
        this.sales = response.body!;
      } 
    })
  }

  private getProducts() {
    this.productService.getByQuery(this.inventory.id, ' ', 0).subscribe(response => {
      if (response.ok) {
        this.products = (response.body as any).products;
      } else {
        responseHandler(response, this.router, this.authService);
      }
    })
  }

  createSale() {
    this.getProducts();
    this.saleCreator = true;
  }

  addProduct() {
    const selectedProduct = this.form.value.products;
    const selectedAmount = this.form.value.amount;
  
    const existingProductIndex = this.cart.findIndex(item => item.product_id === selectedProduct.product);
  
    if (existingProductIndex !== -1) {
      this.cart[existingProductIndex].amount += selectedAmount;
    } else {
      this.cart.push({
        product_id: selectedProduct.product,
        name: selectedProduct.fields.name,
        price: selectedProduct.fields.price,
        amount: selectedAmount
      });
    }

    this.cartEmpty = false;
    this.form.reset();
  }

  removeItem(index: number) {
    this.cart.splice(index, 1);

    if (this.cart.length === 0) {
      this.cartEmpty = true;
    }
  }

  async uploadSale() {
    const requestProducts: ProductElement[] = this.cart.map(({ name, ...rest }) => rest);
    const customer = this.upload.value.customer;

    this.saleService.makePurchase(
      this.inventory.id, customer, "pm_card_visa", requestProducts)
    .subscribe(async response => {
      if (response.ok) {
        this.cart = [];
        this.cartEmpty = true;
        this.upload.reset();
        this.form.reset();
        this.saleCreator = false;
        await showMessageAlert(
          'Sale created successfully',
          '',
          ALERT_ICONS.SUCCESS
        );
        this.getSales();
      } else {
        responseHandler(response, this.router, this.authService);
      }
    });
  }

  refund(sale: Sale) {
    this.saleService.refundPurchase(this.inventory.id, sale._id!).subscribe(response => {
      if (response.ok) {
        this.getSales();
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
}
