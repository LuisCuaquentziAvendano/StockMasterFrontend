import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';
import { HttpResponse } from '@angular/common/http';
import { Inventory } from '../types/inventory';
import { AuthenticationService } from './authentication.service';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private cache = new Map<string, HttpResponse<Inventory>>();

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

  getById(id: string, includeRoles: boolean): Observable<HttpResponse<Inventory>> {
    if (this.cacheHas(id, includeRoles)) {
      return of(this.cacheGet(id, includeRoles));
    }
    return this.httpService.get<HttpResponse<Inventory>>({
      url: `${environment.BASE_URL}/inventories/getInventory`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: id,
      },
    }).pipe(
      switchMap(response => {
        if (!response.ok) {
          return of(response);
        }
        const newInventory = this.formatData(response.body!);
        if (!includeRoles) {
          const newResponse = { ...response, body: newInventory } as HttpResponse<Inventory>;
          this.cacheSet(id, includeRoles, newResponse);
          return of(newResponse);
        }
        return forkJoin({
          inventory: of(newInventory),
          response: this.getPermissions(newInventory.id),
        }).pipe(
          map(({ inventory, response }) => {
            inventory.roles = response.body!;
            const newResponse = { ...response, body: inventory } as HttpResponse<Inventory>;
            this.cacheSet(id, includeRoles, newResponse);
            return newResponse;
          })
        );
      })
    );
  }

  private getPermissions(id: string): Observable<HttpResponse<User[]>> {
    return this.httpService.get<HttpResponse<User[]>>({
      url: `${environment.BASE_URL}/inventories/getPermissions`,
      headers: {
        authorization: this.authService.getToken(),
        inventory: id,
      },
    });
  }

  getByUser(): Observable<HttpResponse<Inventory[]>> {
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
        } as HttpResponse<Inventory[]>;
      })
    );
  }

  updateData(id: string, name: string) {
    this.cacheClear();
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
    this.cacheClear();
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
    this.cacheClear();
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
    this.cacheClear();
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
    this.cacheClear();
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
    this.cacheClear();
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

  private cacheHas(id: string, includeRoles: boolean) {
    const key = this.cacheKey(id, includeRoles);
    return this.cache.has(key)!;
  }

  private cacheGet(id: string, includeRoles: boolean) {
    const key = this.cacheKey(id, includeRoles);
    return this.cache.get(key)!;
  }

  private cacheSet(id: string, includeRoles: boolean, response: HttpResponse<Inventory>) {
    const key = this.cacheKey(id, includeRoles);
    return this.cache.set(key, response);
  }

  private cacheClear() {
    this.cache.clear();
  }

  private cacheKey(id: string, includeRoles: boolean) {
    return `${id} ${includeRoles}`;
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
