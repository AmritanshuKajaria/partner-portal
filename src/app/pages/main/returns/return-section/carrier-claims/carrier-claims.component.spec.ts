import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierClaims } from './carrier-claims.component';

describe('CarrierClaims', () => {
  let component: CarrierClaims;
  let fixture: ComponentFixture<CarrierClaims>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarrierClaims],
    }).compileComponents();

    fixture = TestBed.createComponent(CarrierClaims);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
