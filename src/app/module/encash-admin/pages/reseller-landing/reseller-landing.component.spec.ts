import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellerLandingComponent } from './reseller-landing.component';

describe('ResellerLandingComponent', () => {
  let component: ResellerLandingComponent;
  let fixture: ComponentFixture<ResellerLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResellerLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResellerLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
