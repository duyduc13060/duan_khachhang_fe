import { Component, OnInit, TemplateRef } from '@angular/core';
import { CreateUpdatePromptComponent } from '../create-update-prompt/create-update-prompt.component';
import { MatDialog } from '@angular/material/dialog';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Action } from 'src/app/_model/action.model';
import { CommonFunction } from 'src/app/utils/common-function';
import { PromptService } from 'src/app/_service/prompt-service/prompt.service';
import { ToastrService } from 'ngx-toastr';
import { ManagementPromptComponent } from '../management-prompt.component';

@Component({
  selector: 'app-action-prompt-manage',
  templateUrl: './action-prompt-manage.component.html',
  styleUrls: ['./action-prompt-manage.component.scss']
})
export class ActionPromptManageComponent implements OnInit {

  cellValue;
  rowIndex;
  modalRef: BsModalRef;

  action: Action = new Action()

  constructor(
    private matDialog : MatDialog,
    private modalService: BsModalService,
    private promptService: PromptService,
    private toaStr : ToastrService,
    private managementPromptComponent: ManagementPromptComponent
  ) { }

  ngOnInit() {
    this.action = CommonFunction.getActionOfFunction('QLPT')
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
      CreateUpdatePromptComponent,{
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
      // this.rolesManagerComponent.search(this.rolesManagerComponent.page);
    });
  }

  openModalDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'delete-popup-user' })
    );
  }

  deletePrompt(){
    this.promptService.deletePrompt(this.cellValue.id).subscribe(res=>{
    })
    this.modalRef.hide();
    this.toaStr.success("Xoa thanh cong !!!");
    this.managementPromptComponent.searchPrompt(0);
  }

}
