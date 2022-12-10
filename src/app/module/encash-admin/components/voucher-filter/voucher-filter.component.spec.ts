import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherFilterComponent } from './voucher-filter.component';

describe('VoucherFilterComponent', () => {
  let component: VoucherFilterComponent;
  let fixture: ComponentFixture<VoucherFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
