import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReferDocumentComponent } from './view-refer-document.component';

describe('ViewReferDocumentComponent', () => {
  let component: ViewReferDocumentComponent;
  let fixture: ComponentFixture<ViewReferDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReferDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReferDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
