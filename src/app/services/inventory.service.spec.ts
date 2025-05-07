import { TestBed } from '@angular/core/testing';
import { InventoryService } from './inventory.service';
import { HttpService } from './http.service';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../environments/environment';

describe('InventoryService', () => {
  let service: InventoryService;
  const mockHttpService = {
    post: jasmine.createSpy('post'),
  };
  const mockAuthService = {
    getToken: jasmine.createSpy('getToken').and.returnValue('TOKEN'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            { provide: HttpService, useValue: mockHttpService },
            { provide: AuthenticationService, useValue: mockAuthService },
        ],
    });
    service = TestBed.inject(InventoryService);
  });

  it('should create an inventory', () => {
    expect(service).toBeTruthy();
    service.create('Amazon inventory');
    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockHttpService.post).toHaveBeenCalledWith({
        url: `${environment.BASE_URL}/inventories/createInventory`,
        headers: { authorization: 'TOKEN' },
        body: { name: 'Amazon inventory' },
    });
  });
});
