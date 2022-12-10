import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCodeFilterComponent } from './product-code-filter.component';

describe('ProductCodeFilterComponent', () => {
  let component: ProductCodeFilterComponent;
  let fixture: ComponentFixture<ProductCodeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCodeFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCodeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
