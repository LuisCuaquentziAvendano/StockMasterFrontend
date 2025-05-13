import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { InventoriesListComponent } from './inventories-list.component';
import { AuthenticationService } from '../../../../services/authentication.service';
import { InventoryService } from '../../../../services/inventory.service';
import { of } from 'rxjs';
import { Inventory } from '../../../../types/inventory';
import { ROLES } from '../../../../utils/roles';

describe('InventoriesListComponent', () => {
  let component: InventoriesListComponent;
  let fixture: ComponentFixture<InventoriesListComponent>;
  const inventories: Inventory[] = [
    {
      id: '1',
      name: 'Amazon inventory',
      fields: {},
      myRole: ROLES.ADMIN,
      roles: [],
    },
    {
      id: '2',
      name: 'Mercado Libre inventory',
      fields: {},
      myRole: ROLES.QUERY,
      roles: [],
    },
  ];
  const mockRouterService = {};
  const mockAuthService = {};
  const mockInventoryService = {
    getByUser: jasmine.createSpy('getByUser').and.returnValue(of([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoriesListComponent],
      providers: [
        { provide: Router, useValue: mockRouterService },
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: InventoryService, useValue: mockInventoryService },
      ],
    })
    .compileComponents();
    fixture = TestBed.createComponent(InventoriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render inventories list', () => {
    expect(component).toBeTruthy();
    expect(mockInventoryService.getByUser).toHaveBeenCalled();
    component.inventories = inventories;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const inventoryElements = compiled.querySelectorAll('section div > div');
    expect(inventoryElements.length).toBe(2);
    expect(inventoryElements[0].querySelector('p')?.textContent).toContain('Amazon inventory');
    expect(inventoryElements[0].textContent).toContain('Role: admin');
    expect(inventoryElements[1].querySelector('p')?.textContent).toContain('Mercado Libre inventory');
    expect(inventoryElements[1].textContent).toContain('Role: query');
  });
});
