import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { CreateUpdateUserComponent } from '../create-update-user/create-update-user.component';
import { ManagementUserComponent } from '../management-user.component';
import { MatDialog } from '@angular/material/dialog';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { Action } from 'src/app/_model/action.model';
import { CommonFunction } from 'src/app/utils/common-function';

@Component({
  selector: 'app-action-management-user',
  templateUrl: './action-management-user.component.html',
  styleUrls: ['./action-management-user.component.scss']
})
export class ActionManagementUserComponent implements OnInit {


  modalRef: BsModalRef;
  rowIndex;
  cellValue;

  // @Output() manageUserId = new EventEmitter<any>();

  @Input() count: number;
  @Input() childMessage: number;

  @Input() getId: number;

  action: Action = new Action();

  constructor(
    private matDialog : MatDialog,
    private modalService: BsModalService,
    private userManagement: ManagementUserComponent,
  ) { 
  }

  ngOnInit() {
    this.action = CommonFunction.getActionOfFunction('QLU')
  }

  ngOnChanges(){
    console.log(this.childMessage + "chil");
  }

  agInit(params ): void {
    this.cellValue = params.data;
    this.rowIndex = +params.rowIndex + 1;
    console.log( this.childMessage);  
  }

  openModalUpdate(){
    // const dataEdit = this.cellValue;
   
    this.matDialog.open(
      CreateUpdateUserComponent,{
        // data: dataEdit,
        maxHeight: window.innerHeight + 'px',
        panelClass: 'no-overflow',
        disableClose: false,
        hasBackdrop: true,
        width: '760px',
        autoFocus: false
      }
    ).afterClosed().subscribe((res) => {
      this.userManagement.searchUser();
    });
  }

  openModalDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'delete-popup-user' })
    );
  }

}
