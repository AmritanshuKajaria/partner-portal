import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingClosuresComponent } from './shipping-closures.component';

describe('ShippingClosuresComponent', () => {
  let component: ShippingClosuresComponent;
  let fixture: ComponentFixture<ShippingClosuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShippingClosuresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingClosuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
