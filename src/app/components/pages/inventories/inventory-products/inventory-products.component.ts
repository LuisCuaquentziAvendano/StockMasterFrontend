import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';

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
  selectedImage: File | null = null;
  currentPage = 1;
  lastPage = 1;

  searchId = '';
  searchQuery = '';
  productForm: FormGroup;
  productFormUpdate: FormGroup;

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
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      tags: ['', Validators.required],
      date_added: ['', Validators.required],
      is_featured: ['no', Validators.required],
      stock: ['', Validators.required],
    });

    this.productFormUpdate = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      tags: ['', Validators.required],
      date_added: ['', Validators.required],
      is_featured: ['no', Validators.required],
      stock: ['', Validators.required],
  });
  }

  onSearchById() {
  if (!this.inventory?.id) return;

  this.productService.getById(this.inventory.id, this.searchId).subscribe({
    next: (res) => {
      if (res.ok && res.body) {
        this.foundProduct = res.body;
        const fields = res.body['fields'] || {};

        this.productFormUpdate.patchValue({
          name: fields['name'] || '',
          description: fields['description'] || '',
          price: fields['price'] || '',
          category: fields['category'] || '',
          tags: fields['tags'] || '',
          date_added: fields['date_added'] || '',
          is_featured: fields['is_featured'] ? 'yes' : 'no',
          stock: fields['stock'] || '',
        });
      }
    },
    error: (err) => console.error(err),
  });
  }

  onFileSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    this.selectedImage = fileInput.files[0];
  }
}

  onSearchByQuery() {
    if (!this.inventory?.id) return;
    this.productService.getByQuery(this.inventory.id, this.searchQuery, 1).subscribe({
      next: (res) => {
        if (res.ok && res.body) {
          console.log('Productos:', res.body.products);
          this.foundProducts = res.body.products;
          this.currentPage = res.body.currentPage;
          this.lastPage = res.body.lastPage + 1;
        }
      },
      error: (err) => console.error(err),
    });
  }

  onCreateProduct() {
    if (!this.inventory?.id) return;

    if (this.productForm.invalid || !this.selectedImage) {
    alert('Por favor llena todos los campos y selecciona una imagen.');
    this.productForm.markAllAsTouched();
    return;
  }

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

    if (this.selectedImage) {
    formData.append('image', this.selectedImage);
    }

    this.productService.create(this.inventory.id, formData).subscribe({
      next: (res) => {
        console.log('Producto creado:', res);
        this.productForm.reset({ is_featured: 'no' });
        this.selectedImage = null;
      },
      error: (err) => console.error(err),
    });
  }

  onDeleteProduct() {
  if (!this.inventory?.id || !this.foundProduct?.id) return;

  const confirmDelete = confirm('¿Estás seguro de que quieres eliminar este producto?');
  if (!confirmDelete) return;

  this.productService.delete(this.inventory.id, this.foundProduct.id).subscribe({
    next: () => {
      alert('Producto eliminado correctamente.');
      this.foundProduct = undefined;
      this.searchId = '';
    },
    error: (err) => console.error('Error al eliminar el producto:', err),
  });
}

onUpdateProduct() {
  if (!this.inventory?.id || !this.foundProduct?.id) return;

  if (this.productForm.invalid) {
    alert('Por favor llena todos los campos para actualizar.');
    this.productForm.markAllAsTouched();
    return;
  }

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

  if (this.selectedImage) {
    formData.append('image', this.selectedImage);
  }

  this.productService.update(this.inventory.id, this.foundProduct.id, formData).subscribe({
    next: () => {
      alert('Producto actualizado correctamente.');
      this.selectedImage = null;
    },
    error: (err) => console.error('Error al actualizar el producto:', err),
  });
}


  nextPage() {
  if (this.currentPage < this.lastPage) {
    this.currentPage++;
    this.onSearchByQuery();
  }
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.onSearchByQuery();
  }
}
}
