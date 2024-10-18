import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnLocationComponent } from './return-location.component';

describe('ReturnLocationComponent', () => {
  let component: ReturnLocationComponent;
  let fixture: ComponentFixture<ReturnLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnLocationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
