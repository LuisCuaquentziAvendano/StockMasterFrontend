import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventorySettingsComponent } from './inventory-settings.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../../services/authentication.service';
import { InventoryService } from '../../../../services/inventory.service';
import { of } from 'rxjs';
import { ROLES } from '../../../../utils/roles';
import { Inventory } from '../../../../types/inventory';
import { User } from '../../../../types/user';

describe('InventorySettingsComponent', () => {
  let component: InventorySettingsComponent;
  let fixture: ComponentFixture<InventorySettingsComponent>;

  const inventoryMock: Inventory = {
    id: 'inv1',
    name: 'Test Inventory',
    myRole: ROLES.ADMIN,
    roles: [
        { email: 'admin@example.com', name: 'Admin User', role: ROLES.ADMIN },
        { email: 'stock@example.com', name: 'Stock User', role: ROLES.STOCK },
    ] as unknown as User[],
    fields: {},
  };

  const mockRouter = { navigateByUrl: jasmine.createSpy() };
  const mockRoute = {
    snapshot: {
      paramMap: {
        get: () => 'inv1',
      },
    },
  };
  const mockAuthService = {};
  const mockInventoryService = {
    getById: jasmine.createSpy().and.returnValue(of({ ok: true, body: inventoryMock })),
    updateData: jasmine.createSpy(),
    modifyPermission: jasmine.createSpy(),
    deleteInventory: jasmine.createSpy(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorySettingsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: InventoryService, useValue: mockInventoryService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InventorySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component and load inventory', () => {
    expect(component).toBeTruthy();
    expect(mockInventoryService.getById).toHaveBeenCalledWith('inv1', true);
    expect(component.inventory.name).toBe('Test Inventory');
  });

  it('should render inventory name and roles', () => {
    component.inventory = inventoryMock;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const nameText = compiled.querySelector('.name div p:nth-child(2)')?.textContent;
    expect(nameText).toContain('Test Inventory');

    const emails = compiled.querySelectorAll('tbody .email');
    expect(emails.length).toBe(2);
    expect(emails[0].textContent).toContain('admin@example.com');
    expect(emails[1].textContent).toContain('stock@example.com');
  });
});


