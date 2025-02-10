import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastRemittancesComponent } from './past-remittances.component';

describe('PastRemittancesComponent', () => {
  let component: PastRemittancesComponent;
  let fixture: ComponentFixture<PastRemittancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PastRemittancesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PastRemittancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
