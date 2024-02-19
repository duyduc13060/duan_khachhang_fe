import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Optional } from 'ag-grid-community';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-detail-document',
  templateUrl: './view-detail-document.component.html',
  styleUrls: ['./view-detail-document.component.scss']
})
export class ViewDetailDocumentComponent implements OnInit {

  cellValue;
  rowIndex;
  modalRef: BsModalRef;
  content;

  constructor(
    public dialogRef: MatDialogRef<ViewDetailDocumentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toaStr : ToastrService,
  ) { 
    console.log(data);
    this.content = data.content
  }

  ngOnInit() {
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

}
