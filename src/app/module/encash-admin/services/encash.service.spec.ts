import { TestBed } from '@angular/core/testing';

import { EncashService } from './encash.service';

describe('EncashService', () => {
  let service: EncashService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncashService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
