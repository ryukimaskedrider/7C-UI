import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentFirstGenComponent } from './recent-first-gen.component';

describe('RecentFirstGenComponent', () => {
  let component: RecentFirstGenComponent;
  let fixture: ComponentFixture<RecentFirstGenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentFirstGenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentFirstGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
