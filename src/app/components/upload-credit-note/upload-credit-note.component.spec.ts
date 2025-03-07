import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCreditNote } from './upload-credit-note.component';

describe('UploadCreditNote', () => {
  let component: UploadCreditNote;
  let fixture: ComponentFixture<UploadCreditNote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadCreditNote],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadCreditNote);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
