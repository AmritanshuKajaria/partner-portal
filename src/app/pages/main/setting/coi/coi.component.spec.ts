import { ComponentFixture, TestBed } from '@angular/core/testing';

import { COIComponent } from './coi.component';

describe('COIComponent', () => {
  let component: COIComponent;
  let fixture: ComponentFixture<COIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [COIComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(COIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
