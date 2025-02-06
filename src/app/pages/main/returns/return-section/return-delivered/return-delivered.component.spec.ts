import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnDelivered } from './return-delivered.component';

describe('ReturnDelivered', () => {
  let component: ReturnDelivered;
  let fixture: ComponentFixture<ReturnDelivered>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnDelivered],
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnDelivered);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
