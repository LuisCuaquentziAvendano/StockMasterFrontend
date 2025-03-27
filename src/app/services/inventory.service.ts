import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment.development';
import { HttpResponse } from '@angular/common/http';
import { Inventory } from '../types/inventory';
import { AuthenticationService } from './authentication.service';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  constructor(
    private httpService: HttpService,
    private authService: AuthenticationService
  ) {}

  create(name: string) {
    return this.httpService.post({
      url: `${environment.BASE_URL}/inventories/createInventory`,
      headers: { authorization: this.authService.getToken() },
      body: { name },
    });
  }

  getById(id: string, includeRoles: boolean) {
    return this.httpService.get<HttpResponse<Inventory>>({
      url: `${environment.BASE_URL}/inventories/getInventory`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: id,
      },
    }).pipe(
      switchMap(response => {
        if (!response.ok || !includeRoles) {
          return of(response);
        }
        const newInventory = this.formatData(response.body!);
        return forkJoin({
          inventory: of(newInventory),
          response: this.getPermissions(newInventory.id),
        }).pipe(
          map(({ inventory, response }) => {
            inventory.roles = response.body!;
            return { ...response, body: inventory };
          })
        );
      })
    );
  }

  private getPermissions(id: string) {
    return this.httpService.get<HttpResponse<User[]>>({
      url: `${environment.BASE_URL}/inventories/getPermissions`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: id,
      },
    });
  }

  getByUser() {
    return this.httpService.get<HttpResponse<Inventory[]>>({
      url: `${environment.BASE_URL}/users/getInventories`,
      headers: { authorization: this.authService.getToken() },
    }).pipe(
      map(response => {
        if (!response.ok) {
          return response;
        }
        const newInventories = response.body?.map(inventory => this.formatData(inventory));
        return {
          ...response,
          body: newInventories,
        };
      })
    );
  }

  updateData(id: string, name: string) {
    return this.httpService.put({
      url: `${environment.BASE_URL}/inventories/updateData`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: id,
      },
      body: { name },
    });
  }

  createField(id: string, fieldsData: InventoryFieldCreate[]) {
    return this.httpService.put({
      url: `${environment.BASE_URL}/inventories/createField`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: id,
      },
      body: fieldsData,
    });
  }

  updateField(id: string, fieldsData: InventoryFieldUpdate) {
    return this.httpService.put({
      url: `${environment.BASE_URL}/inventories/updateField`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: id,
      },
      body: fieldsData,
    });
  }

  deleteField(id: string, field: string) {
    return this.httpService.put({
      url: `${environment.BASE_URL}/inventories/deleteField`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: id,
      },
      body: { field },
    });
  }

  modifyPermission(id: string, email: string, role: string) {
    return this.httpService.put({
      url: `${environment.BASE_URL}/inventories/modifyPermission`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: id,
      },
      body: { email, role },
    });
  }

  deleteInventory(id: string) {
    return this.httpService.delete({
      url: `${environment.BASE_URL}/inventories/deleteInventory`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: id,
      },
    });
  }

  private formatData(inventory: Inventory) {
    const newInventory = inventory as Record<string, any>;
    const items = {
      id: newInventory['inventory'],
      name: newInventory['name'],
      myRole: newInventory['role'],
    };
    return {
      ...inventory,
      ...items
    };
  }
}

interface InventoryFieldCreate {
  field: string;
  type: string;
  visible: boolean;
}

interface InventoryFieldUpdate {
  field: string;
  newName: string;
  visible: boolean;
}
