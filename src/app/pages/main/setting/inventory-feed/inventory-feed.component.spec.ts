import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryFeedComponent } from './inventory-feed.component';

describe('InventoryFeedComponent', () => {
  let component: InventoryFeedComponent;
  let fixture: ComponentFixture<InventoryFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryFeedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
