import { TestBed } from '@angular/core/testing';
import { SaleService } from './sale.service';
import { HttpService } from './http.service';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../environments/environment';
import { PurchasedProduct } from '../types/sale';

describe('SaleService', () => {
  let service: SaleService;

  const mockHttpService = {
    post: jasmine.createSpy('post'),
    get: jasmine.createSpy('get'),
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
    service = TestBed.inject(SaleService);
  });

  it('should make a purchase', () => {
    const products: PurchasedProduct[] = [
      { product_id: '1', amount: "2", price: "100" },
    ];
    service.makePurchase('inv-123', 'John Doe', 'pm-456', products);
    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockHttpService.post).toHaveBeenCalledWith({
      url: `${environment.BASE_URL}/sales/makePurchase`,
      headers: {
        authorization: 'TOKEN',
        inventory: 'inv-123',
      },
      body: {
        customer: 'John Doe',
        paymentMethodId: 'pm-456',
        products,
      },
    });
  });
});
