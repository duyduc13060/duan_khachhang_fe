import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbSingleDatePickerComponent } from './ngb-single-date-picker.component';

describe('NgbSingleDatePickerComponent', () => {
  let component: NgbSingleDatePickerComponent;
  let fixture: ComponentFixture<NgbSingleDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgbSingleDatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbSingleDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
