import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';
import { SaleRecord } from '../types/sale-record';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SaleRecordService {

  constructor(    
    private httpService: HttpService,
    private authService: AuthenticationService
  ) { }

  createSalesRecord(inventoryId: string, parameterType: string, parameterId: string) {
    return this.httpService.post({
      url: `${environment.BASE_URL}/salesRecords/createSalesRecord`,
      headers: { 
        authorization: this.authService.getToken(), 
        inventory: inventoryId,
      },
      body: { parameterType, parameterId },
    });
  }

  updateSalesRecord(inventoryId: string, salesRecordId: string, parameterType: string, parameterId: string) {
    return this.httpService.put({
      url: `${environment.BASE_URL}/salesRecords/updateSalesRecord`,
      headers: { 
        authorization: this.authService.getToken(), 
        inventory: inventoryId,
      },
      body: { salesRecordId, parameterType, parameterId },
    });
  }

  getAllSalesRecords(inventoryId: string) {
    return this.httpService.get<HttpResponse<SaleRecord[]>>({
      url: `${environment.BASE_URL}/salesRecords/getAllSalesRecords`,
      headers: { 
        authorization: this.authService.getToken(), 
        inventory: inventoryId,
      },
    });
  }

  deleteSalesRecord(inventoryId: string, salesRecordId: string) {
    return this.httpService.delete({
      url: `${environment.BASE_URL}/salesRecords/deleteSalesRecord`,
      headers: { 
        authorization: this.authService.getToken(), 
        inventory: inventoryId,
      },
      body: { salesRecordId },
    });
  }
}
