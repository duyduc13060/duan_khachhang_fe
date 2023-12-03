import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionRolesManagerComponent } from './action-roles-manager.component';

describe('ActionRolesManagerComponent', () => {
  let component: ActionRolesManagerComponent;
  let fixture: ComponentFixture<ActionRolesManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionRolesManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionRolesManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
