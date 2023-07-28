import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSingleProductCalculatorComponent } from './new-single-product-calculator.component';

describe('NewSingleProductCalculatorComponent', () => {
  let component: NewSingleProductCalculatorComponent;
  let fixture: ComponentFixture<NewSingleProductCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSingleProductCalculatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSingleProductCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
