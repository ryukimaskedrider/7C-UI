import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppListMenuComponent } from './app-list-menu.component';

describe('AppListMenuComponent', () => {
  let component: AppListMenuComponent;
  let fixture: ComponentFixture<AppListMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppListMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppListMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
