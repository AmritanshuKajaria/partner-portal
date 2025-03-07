import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedActionComponent } from './need-action.component';

describe('NeedActionComponent', () => {
  let component: NeedActionComponent;
  let fixture: ComponentFixture<NeedActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NeedActionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NeedActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
