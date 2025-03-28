import { Injectable } from '@angular/core';
import { Product } from '../types/product';
import { HttpService } from './http.service';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../environments/environment.development';
import { HttpResponse } from '@angular/common/http';
import { map, Observable, of, switchMap } from 'rxjs';

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

  getById(inventoryId: string, productId: string): Observable<HttpResponse<Product>> {
    return this.httpService.get<HttpResponse<Product>>({
      url: `${environment.BASE_URL}/products/getProductById`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: inventoryId,
        product: productId,
      },
    });
  }

  getImage(inventoryId: string, productId: string, field: string): Observable<HttpResponse<ImageResponse>> {
    return this.httpService.getImage({
      url: `${environment.BASE_URL}/images/getImage`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: inventoryId,
        product: productId,
      },
      params: { field },
    }).pipe(
      map(response => {
        if (!response.ok) {
          return response as unknown as HttpResponse<ImageResponse>;
        }
        const objectUrl = URL.createObjectURL(response.body!);
        return {
          ...response,
          body: { url: objectUrl },
        } as HttpResponse<ImageResponse>;
      })
    );
  }

  getByQuery(inventoryId: string, query: string, page: number): Observable<HttpResponse<Product[]>> {
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

interface ImageResponse {
  url: string;
}
