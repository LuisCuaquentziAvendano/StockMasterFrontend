import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { InventoryService } from '../services/inventory.service';
import { lastValueFrom } from 'rxjs';
import { responseHandler } from '../utils/responseHandler';
import { AuthenticationService } from '../services/authentication.service';
import { HttpResponse } from '@angular/common/http';
import { Inventory } from '../types/inventory';

export const RoleGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const inventoryService = inject(InventoryService);
  const id = route.paramMap.get('id') as string;
  const response = await lastValueFrom(inventoryService.getById(id, true));
  if (!response.ok) {
    responseHandler(response as HttpResponse<Inventory>, router, authService);
    return false;
  }
  const userRole = response.body?.myRole;
  const requiredRoles = route.data['roles'];
  if (!requiredRoles.includes(userRole)) {
    router.navigateByUrl('/forbidden');
    return false;
  }
  return true;
};
