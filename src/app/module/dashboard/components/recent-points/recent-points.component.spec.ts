import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentPointsComponent } from './recent-points.component';

describe('RecentPointsComponent', () => {
  let component: RecentPointsComponent;
  let fixture: ComponentFixture<RecentPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentPointsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
