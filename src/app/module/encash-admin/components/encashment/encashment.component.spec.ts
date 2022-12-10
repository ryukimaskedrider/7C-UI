import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncashmentComponent } from './encashment.component';

describe('EncashmentComponent', () => {
  let component: EncashmentComponent;
  let fixture: ComponentFixture<EncashmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncashmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncashmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
