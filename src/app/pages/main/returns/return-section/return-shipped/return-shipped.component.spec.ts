import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnShipped } from './return-shipped.component';

describe('ReturnShipped', () => {
  let component: ReturnShipped;
  let fixture: ComponentFixture<ReturnShipped>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnShipped],
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnShipped);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
