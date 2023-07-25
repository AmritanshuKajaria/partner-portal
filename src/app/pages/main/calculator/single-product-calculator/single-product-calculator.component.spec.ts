import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProductCalculatorComponent } from './single-product-calculator.component';

describe('SingleProductCalculatorComponent', () => {
  let component: SingleProductCalculatorComponent;
  let fixture: ComponentFixture<SingleProductCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleProductCalculatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleProductCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
