import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterProductCodeComponent } from './register-product-code.component';

describe('RegisterProductCodeComponent', () => {
  let component: RegisterProductCodeComponent;
  let fixture: ComponentFixture<RegisterProductCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterProductCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterProductCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
