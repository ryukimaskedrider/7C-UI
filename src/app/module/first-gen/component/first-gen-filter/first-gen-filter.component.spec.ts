import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstGenFilterComponent } from './first-gen-filter.component';

describe('FirstGenFilterComponent', () => {
  let component: FirstGenFilterComponent;
  let fixture: ComponentFixture<FirstGenFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstGenFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstGenFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
