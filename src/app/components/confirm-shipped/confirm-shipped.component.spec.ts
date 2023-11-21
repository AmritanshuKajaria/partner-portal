import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmShippedComponent } from './confirm-shipped.component';

describe('ConfirmShippedComponent', () => {
  let component: ConfirmShippedComponent;
  let fixture: ComponentFixture<ConfirmShippedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmShippedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmShippedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
