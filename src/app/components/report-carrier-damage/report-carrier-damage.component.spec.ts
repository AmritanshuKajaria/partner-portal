import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCarrierDamage } from './report-carrier-damage.component';

describe('ReportCarrierDamage', () => {
  let component: ReportCarrierDamage;
  let fixture: ComponentFixture<ReportCarrierDamage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportCarrierDamage],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportCarrierDamage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
