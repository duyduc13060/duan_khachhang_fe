import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Action } from 'src/app/_model/action.model';
import { DocumentManagementPortalComponent } from '../document-management-portal.component';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { QuestionAnswerServiceService } from 'src/app/_service/question-answer-service/question-answer-service.service';
import { CommonFunction } from 'src/app/utils/common-function';

@Component({
  selector: 'app-action-document-portal',
  templateUrl: './action-document-portal.component.html',
  styleUrls: ['./action-document-portal.component.scss']
})
export class ActionDocumentPortalComponent implements OnInit {
  cellValue;
  rowIndex;
  modalRef: BsModalRef;

  action: Action = new Action()

  constructor(
    private matDialog : MatDialog,
    private modalService: BsModalService,
    private questionAnswerServiceService: QuestionAnswerServiceService,
    private toaStr : ToastrService,
    private documentManagementPortalComponent: DocumentManagementPortalComponent
  ) { }

  ngOnInit() {
    this.action = CommonFunction.getActionOfFunction('QLQS')
  }

  agInit(params ): void {
    this.cellValue = params.data;
    console.log(this.cellValue);
    this.rowIndex = +params.rowIndex + 1;
  }

  refresh(params) {
    // set value into cell again
    return true
  }

  openModalDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'delete-popup-user' })
    );
  }


  deleteDocument(){
    console.log(this.cellValue.filename);
    this.questionAnswerServiceService.deleteDocumentFilename(this.cellValue.fileName).subscribe(res=>{
      
    })
    this.toaStr.success("Xoa thanh cong !!!");
    this.modalRef.hide();
    // this.documentManagementPortalComponent.searchCreator(1);
    window.location.reload();
  }

}
