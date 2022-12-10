import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstGenComponent } from './first-gen.component';

describe('FirstGenComponent', () => {
  let component: FirstGenComponent;
  let fixture: ComponentFixture<FirstGenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstGenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
