import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMultiProductCalculatorComponent } from './new-multi-product-calculator.component';

describe('NewMultiProductCalculatorComponent', () => {
  let component: NewMultiProductCalculatorComponent;
  let fixture: ComponentFixture<NewMultiProductCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMultiProductCalculatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMultiProductCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
