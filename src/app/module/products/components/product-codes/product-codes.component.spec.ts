import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCodesComponent } from './product-codes.component';

describe('ProductCodesComponent', () => {
  let component: ProductCodesComponent;
  let fixture: ComponentFixture<ProductCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
