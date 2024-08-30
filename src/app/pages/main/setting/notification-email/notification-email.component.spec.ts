import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationEmailComponent } from './notification-email.component';

describe('NotificationEmailComponent', () => {
  let component: NotificationEmailComponent;
  let fixture: ComponentFixture<NotificationEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationEmailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
