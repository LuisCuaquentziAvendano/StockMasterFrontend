import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { AboutUsComponent } from './components/pages/about-us/about-us.component';
import { LoginComponent } from './components/pages/login/login.component';
import { InventoriesComponent } from './components/pages/inventories/inventories.component';
import { NotificationsComponent } from './components/pages/notifications/notifications.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { InventoriesListComponent } from './components/pages/inventories/inventories-list/inventories-list.component';
import { InventorySchemaComponent } from './components/pages/inventories/inventory-schema/inventory-schema.component';
import { InventoryProductsComponent } from './components/pages/inventories/inventory-products/inventory-products.component';
import { InventorySalesComponent } from './components/pages/inventories/inventory-sales/inventory-sales.component';
import { InventorySettingsComponent } from './components/pages/inventories/inventory-settings/inventory-settings.component';
import { AuthenticationGuard } from './guards/auth.guard';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { ForbiddenComponent } from './components/pages/forbidden/forbidden.component';
import { RoleGuard } from './guards/role.guard';
import { ROLES } from './utils/roles';
import { ServerErrorComponent } from './components/pages/server-error/server-error.component';
import { InventoryRecordsComponent } from './components/pages/inventories/inventory-records/inventory-records.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthenticationGuard(false)],
    },
    {
        path: 'about-us',
        component: AboutUsComponent,
        canActivate: [AuthenticationGuard(false)],
    },
    { path: 'login', component: LoginComponent },
    {
        path: 'inventories',
        component: InventoriesComponent,
        canActivate: [AuthenticationGuard(true)],
        children: [
            { path: '', component: InventoriesListComponent },
            { path: ':id/schema', component: InventorySchemaComponent, },
            { path: ':id/products', component: InventoryProductsComponent },
            {
                path: ':id/sales',
                component: InventorySalesComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [ROLES.ADMIN, ROLES.STOCK],
                },
            },
            {
                path: ':id/records',
                component: InventoryRecordsComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [ROLES.ADMIN, ROLES.STOCK],
                },
            },
            {
                path: ':id/settings',
                component: InventorySettingsComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [ROLES.ADMIN],
                },
            },
        ],
    },
    {
        path: 'notifications',
        component: NotificationsComponent,
        canActivate: [AuthenticationGuard(true)],
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthenticationGuard(true)],
    },
    { path: 'forbidden', component: ForbiddenComponent, },
    { path: 'not-found', component: NotFoundComponent, },
    { path: 'server-error', component: ServerErrorComponent, },
    { path: '**', component: NotFoundComponent, },
];
