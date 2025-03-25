import { Injectable } from '@angular/core';
import { Product } from '../types/product';
import { HttpService } from './http.service';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../environments/environment.development';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private httpService: HttpService,
    private authService: AuthenticationService
  ) {}

  create(inventoryId: string, productData: FormData) {
    return this.httpService.post({
      url: `${environment.BASE_URL}/products/createProduct`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: inventoryId,
      },
      body: productData,
    });
  }

  getById(inventoryId: string, productId: string) {
    return this.httpService.get<HttpResponse<Product>>({
      url: `${environment.BASE_URL}/products/getProductById`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: inventoryId,
        product: productId,
      },
    });
  }

  getByQuery(inventoryId: string, query: string, page: number) {
    return this.httpService.get<HttpResponse<Product[]>>({
      url: `${environment.BASE_URL}/products/getProductsByQuery`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: inventoryId,
      },
      params: { query, page: page.toString() },
    });
  }

  update(inventoryId: string, productId: string, productData: FormData) {
    return this.httpService.put({
      url: `${environment.BASE_URL}/products/updateProduct`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: inventoryId,
        product: productId,
      },
      body: productData,
    });
  }

  delete(inventoryId: string, productId: string) {
    return this.httpService.delete({
      url: `${environment.BASE_URL}/products/deleteProduct`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: inventoryId,
        product: productId,
      },
    });
  }
}
