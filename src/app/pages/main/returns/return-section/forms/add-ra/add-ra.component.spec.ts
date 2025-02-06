import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRa } from './add-ra.component';

describe('AddRa', () => {
  let component: AddRa;
  let fixture: ComponentFixture<AddRa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRa],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
