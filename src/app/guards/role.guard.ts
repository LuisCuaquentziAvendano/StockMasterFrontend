import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { InventoryService } from '../services/inventory.service';
import { lastValueFrom } from 'rxjs';

export const RoleGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const inventoryService = inject(InventoryService);
  const inventory = await lastValueFrom(inventoryService.getById('id'));
  const userRole = inventory.body?.myRole;
  const requiredRoles = route.data['roles'];
  if (!requiredRoles.includes(userRole)) {
    router.navigateByUrl('/forbidden');
    return false;
  }
  return true;
};
