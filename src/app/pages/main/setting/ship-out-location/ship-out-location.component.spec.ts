import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipOutLocationComponent } from './ship-out-location.component';

describe('ShipOutLocationComponent', () => {
  let component: ShipOutLocationComponent;
  let fixture: ComponentFixture<ShipOutLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShipOutLocationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShipOutLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
