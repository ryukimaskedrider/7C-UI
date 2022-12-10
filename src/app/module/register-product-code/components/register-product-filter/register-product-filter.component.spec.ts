import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterProductFilterComponent } from './register-product-filter.component';

describe('RegisterProductFilterComponent', () => {
  let component: RegisterProductFilterComponent;
  let fixture: ComponentFixture<RegisterProductFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterProductFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterProductFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
