import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemittanceInfoComponent } from './remittance-info.component';

describe('RemittanceInfoComponent', () => {
  let component: RemittanceInfoComponent;
  let fixture: ComponentFixture<RemittanceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemittanceInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RemittanceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
