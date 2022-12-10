import { TestBed } from '@angular/core/testing';

import { RegisterProductCodeService } from './register-product-code.service';

describe('RegisterProductCodeService', () => {
  let service: RegisterProductCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterProductCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
