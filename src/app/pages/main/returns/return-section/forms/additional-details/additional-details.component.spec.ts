import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDetailComponent } from './additional-details.component';

describe('ReportCarrierDamage', () => {
  let component: AdditionalDetailComponent;
  let fixture: ComponentFixture<AdditionalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdditionalDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
