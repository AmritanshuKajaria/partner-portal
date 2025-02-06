import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveCredit } from './approve-credit.component';

describe('ApproveCredit', () => {
  let component: ApproveCredit;
  let fixture: ComponentFixture<ApproveCredit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApproveCredit],
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveCredit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
