import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Inventory } from '../../../../types/inventory';
import { AuthenticationService } from '../../../../services/authentication.service';
import { InventoryService } from '../../../../services/inventory.service';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../types/product';
import { responseHandler } from '../../../../utils/responseHandler';

@Component({
  selector: 'app-inventory-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './inventory-products.component.html',
  styleUrl: './inventory-products.component.scss'
})
export class InventoryProductsComponent {
  inventory = null as unknown as Inventory;

  searchId = '';
  searchQuery = '';
  productForm: FormGroup;

  foundProduct?: Product;
  foundProducts: Product[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private productService: ProductService,
    private inventoryService: InventoryService,
    private fb: FormBuilder
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.inventoryService.getById(id, false).subscribe((response) => {
      if (response.ok) {
        this.inventory = response.body!;
      } else {
        responseHandler(response, this.router, this.authService);
      }
    });

    this.productForm = this.fb.group({
      name: [''],
      description: [''],
      price: [''],
      category: [''],
      tags: [''],
      date_added: [''],
      is_featured: ['no'],
      stock: [''],
    });
  }

  onSearchById() {
    if (!this.inventory?.id) return;
    this.productService.getById(this.inventory.id, this.searchId).subscribe({
      next: (res) => {
        if (res.ok && res.body) {
          this.foundProduct = res.body;
        }
      },
      error: (err) => console.error(err),
    });
  }

  onSearchByQuery() {
    if (!this.inventory?.id) return;
    this.productService.getByQuery(this.inventory.id, this.searchQuery, 1).subscribe({
      next: (res) => {
        if (res.ok && res.body) {
          this.foundProducts = res.body.products;
        }
      },
      error: (err) => console.error(err),
    });
  }

  onCreateProduct() {
    if (!this.inventory?.id) return;
    const formValue = this.productForm.value;

    const formData = new FormData();
    formData.append('name', formValue.name);
    formData.append('description', formValue.description);
    formData.append('price', formValue.price);
    formData.append('category', formValue.category);
    formData.append('tags', formValue.tags);
    formData.append('date_added', formValue.date_added);
    formData.append('is_featured', formValue.is_featured);
    formData.append('stock', formValue.stock);

    this.productService.create(this.inventory.id, formData).subscribe({
      next: (res) => {
        console.log('Producto creado:', res);
        this.productForm.reset({ is_featured: 'no' });
      },
      error: (err) => console.error(err),
    });
  }
}
