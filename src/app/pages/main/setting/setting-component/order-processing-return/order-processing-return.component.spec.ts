import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderProcessingReturnComponent } from './order-processing-return.component';

describe('OrderProcessingReturnComponent', () => {
  let component: OrderProcessingReturnComponent;
  let fixture: ComponentFixture<OrderProcessingReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderProcessingReturnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderProcessingReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
