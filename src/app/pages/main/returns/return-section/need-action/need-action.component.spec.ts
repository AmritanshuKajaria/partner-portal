import { ComponentFixture, TestBed } from '@angular/core/testing';

import { need-action } from './need-action.component';

describe('need-action', () => {
  let component: need-action;
  let fixture: ComponentFixture<need-action>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [need-action],
    }).compileComponents();

    fixture = TestBed.createComponent(need-action);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
