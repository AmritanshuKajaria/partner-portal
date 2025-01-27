import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMultipleProductsComponent } from './add-edit-multiple-products.component';

describe('AddEditMultipleProductsComponent', () => {
  let component: AddEditMultipleProductsComponent;
  let fixture: ComponentFixture<AddEditMultipleProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditMultipleProductsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditMultipleProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
