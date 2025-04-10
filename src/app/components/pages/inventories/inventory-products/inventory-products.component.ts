import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Inventory } from '../../../../types/inventory';
import { AuthenticationService } from '../../../../services/authentication.service';
import { InventoryService } from '../../../../services/inventory.service';
import { responseHandler } from '../../../../utils/responseHandler';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'app-inventory-products',
  standalone: true,
  imports: [],
  templateUrl: './inventory-products.component.html',
  styleUrl: './inventory-products.component.scss'
})
export class InventoryProductsComponent {
  inventory = null as unknown as Inventory;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private productService: ProductService,
    private inventoryService: InventoryService
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
  }
}
