import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnToSender } from './return-to-sender.component';

describe('ReturnToSender', () => {
  let component: ReturnToSender;
  let fixture: ComponentFixture<ReturnToSender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnToSender],
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnToSender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
