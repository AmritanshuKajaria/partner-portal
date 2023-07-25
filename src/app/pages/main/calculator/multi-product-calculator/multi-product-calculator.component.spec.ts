import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiProductCalculatorComponent } from './multi-product-calculator.component';

describe('MultiProductCalculatorComponent', () => {
  let component: MultiProductCalculatorComponent;
  let fixture: ComponentFixture<MultiProductCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiProductCalculatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiProductCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
