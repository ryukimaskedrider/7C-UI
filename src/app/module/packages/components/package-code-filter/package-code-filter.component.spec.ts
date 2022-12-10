import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageCodeFilterComponent } from './package-code-filter.component';

describe('PackageCodeFilterComponent', () => {
  let component: PackageCodeFilterComponent;
  let fixture: ComponentFixture<PackageCodeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageCodeFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageCodeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
