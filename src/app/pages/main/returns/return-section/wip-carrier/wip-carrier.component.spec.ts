import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WipCarrier } from './wip-carrier.component';

describe('WipCarrier', () => {
  let component: WipCarrier;
  let fixture: ComponentFixture<WipCarrier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WipCarrier],
    }).compileComponents();

    fixture = TestBed.createComponent(WipCarrier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
