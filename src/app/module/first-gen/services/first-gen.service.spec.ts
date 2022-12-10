import { TestBed } from '@angular/core/testing';

import { FirstGenService } from './first-gen.service';

describe('FirstGenService', () => {
  let service: FirstGenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstGenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
