import { Injectable } from '@angular/core';
import { Product } from '../types/product';
import { HttpService } from './http.service';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../environments/environment';
import { HttpResponse } from '@angular/common/http';
import { map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private httpService: HttpService,
    private authService: AuthenticationService
  ) { }

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
    }).pipe(
      map(response => {
        if (!response.ok) {
          return response;
        }
        const newProduct = this.formatProduct(response.body!);
        return {
          ...response,
          body: newProduct,
        } as HttpResponse<Product>;
      }),
    );
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

  getByQuery(inventoryId: string, query: string, page: number): Observable<HttpResponse<GetByQueryResponse>> {
    return this.httpService.get<HttpResponse<GetByQueryResponse>>({
      url: `${environment.BASE_URL}/products/getProductsByQuery`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: inventoryId,
      },
      params: { query, page: page.toString() },
    }).pipe(
      map(response => {
        if (!response.ok) {
          return response;
        }
        const newProducts = this.formatGetByQuery(response.body!) as GetByQueryResponse;
        return {
          ...response,
          body: newProducts,
        } as HttpResponse<GetByQueryResponse>;
      }),
    );
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

  private formatGetByQuery(response: GetByQueryResponse) {
    const newResponse = response as Record<string, any>;
    const items = {
      inventoryId: newResponse['inventory'],
      products: newResponse['products'].map((product: Product) => this.formatProduct(product)),
    };
    return {
      ...response,
      ...items,
    };
  }

  private formatProduct(product: Product) {
    const newProduct = product as Record<string, any>;
    const items = {
      id: newProduct['product'],
    };
    return {
      ...product,
      ...items,
    };
  }
}

interface ImageResponse {
  url: string;
}

interface GetByQueryResponse {
  currentPage: number;
  inventoryId: number;
  lastPage: number;
  products: Product[];
  totalProducts: number;
}
