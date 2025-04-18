import { TestBed } from '@angular/core/testing';

import { CouponManagerService } from './coupon-manager.service';

describe('CouponManagerService', () => {
  let service: CouponManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CouponManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
