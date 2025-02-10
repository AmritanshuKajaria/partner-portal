import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenBalancesComponent } from './open-balances.component';

describe('OpenBalancesComponent', () => {
  let component: OpenBalancesComponent;
  let fixture: ComponentFixture<OpenBalancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenBalancesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenBalancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
