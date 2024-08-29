import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapHandlingComponent } from './map-handling.component';

describe('MapHandlingComponent', () => {
  let component: MapHandlingComponent;
  let fixture: ComponentFixture<MapHandlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapHandlingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapHandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
