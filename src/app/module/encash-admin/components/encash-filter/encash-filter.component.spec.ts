import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncashFilterComponent } from './encash-filter.component';

describe('EncashFilterComponent', () => {
  let component: EncashFilterComponent;
  let fixture: ComponentFixture<EncashFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncashFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncashFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
