import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { HttpService } from './http.service';
import { PurchasedProduct, Sale } from '../types/sale';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(
    private httpService: HttpService,
    private authService: AuthenticationService
  ) {}

  makePurchase(inventoryId: string, customer: string, paymentMethodId: string, products: PurchasedProduct[]) {
    return this.httpService.post({
      url: `${environment.BASE_URL}/sales/makePurchase`,
      headers: { 
        authorization: this.authService.getToken(), 
        inventory: inventoryId,
      },
      body: { customer, paymentMethodId, products },
    });
  }

  getSales(inventoryId: string) {
    return this.httpService.get<HttpResponse<Sale[]>>({
      url: `${environment.BASE_URL}/sales/getSalesByInventory`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: inventoryId,
      },
    });
  }

  refundPurchase(inventoryId: string, saleId: string) {
    return this.httpService.post({
      url: `${environment.BASE_URL}/sales/refundPurchase`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: inventoryId,
      },
      body: { saleId },
    });
  }

  getPurchaseOrder(inventoryId: string, saleId: string) {
    return this.httpService.get<HttpResponse<Sale>>({
      url: `${environment.BASE_URL}/sales/getPurchaseOrder`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: inventoryId,
      },
      body: { saleId },
    });
  }
}
