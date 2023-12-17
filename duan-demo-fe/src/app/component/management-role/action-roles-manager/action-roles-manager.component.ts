import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {CreateUpdateRolesComponent} from '../create-update-roles/create-update-roles.component';
import { RolesService } from 'src/app/_service/role-service/roles.service';
import { ManagementRoleComponent } from '../management-role.component';
import { CommonFunction } from 'src/app/utils/common-function';
import { Action } from 'src/app/_model/action.model';

@Component({
  selector: 'kt-action-roles-manager',
  templateUrl: './action-roles-manager.component.html',
  styleUrls: ['./action-roles-manager.component.scss']
})
export class ActionRolesManagerComponent implements OnInit {


  rowIndex;
  cellValue;
  modalRef: BsModalRef;
  action: Action = new Action()
  constructor(
    private modalService: BsModalService,
    private matDialog : MatDialog,
    private toaStr: ToastrService,
    private rolesManagerService: RolesService,
    private rolesManagerComponent: ManagementRoleComponent
  ) { }

  ngOnInit(): void {
    this.action = CommonFunction.getActionOfFunction('QLR')
  }

  agInit(params ): void {
    this.cellValue = params.data;
    this.rowIndex = +params.rowIndex + 1;
  }

  refresh(params) {
    // set value into cell again
    return true
  }

  openModalUpdate(){
    const dataEdit = this.cellValue;
    this.matDialog.open(
      CreateUpdateRolesComponent,{
        data: dataEdit,
        maxHeight: '90vh',
        panelClass:'list-trans-seller',
        disableClose: false,
        hasBackdrop: true,
        width: '760px',
        autoFocus: false
      }
    ).afterClosed().subscribe((res) => {
      console.log(res);
      this.rolesManagerComponent.search(this.rolesManagerComponent.page);
    });
  }

  openModalDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'delete-popup-user' })
    );
  }

  deleteUser(){
    const body = {
      id: this.cellValue.id
    }
    this.rolesManagerService.delete(body).subscribe(res => {
      if(res.status === 'OK'){
        this.toaStr.success(res.message);
        if(this.rolesManagerComponent.totalRecord % 10 === 1 && this.rolesManagerComponent.page === this.rolesManagerComponent.totalPage){
          this.rolesManagerComponent.search(1);
        }else{
          this.rolesManagerComponent.search(this.rolesManagerComponent.page);
        }
        this.modalRef.hide();
      } else {
        this.modalRef.hide();
        this.toaStr.error(res.message);
        this.rolesManagerComponent.search(this.rolesManagerComponent.page);
      }
    })
  }
}
