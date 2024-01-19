import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewChatManagementComponent } from './review-chat-management.component';

describe('ReviewChatManagementComponent', () => {
  let component: ReviewChatManagementComponent;
  let fixture: ComponentFixture<ReviewChatManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewChatManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewChatManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
