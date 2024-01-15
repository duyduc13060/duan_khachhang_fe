import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Optional } from 'ag-grid-community';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ClickLikeService } from 'src/app/_service/click-service/click-like.service';
import { changeWidthAgCenterColsContainerStyleHasMinWidth } from 'src/app/helpers/utils';

@Component({
  selector: 'app-view-detail-prompt',
  templateUrl: './view-detail-prompt.component.html',
  styleUrls: ['./view-detail-prompt.component.scss']
})
export class ViewDetailPromptComponent implements OnInit {

  columnDefs;
  rowData;
  headerHeight = 48
  rowHeight = 94
  gridApi;
  gridColumnApi;
  isShowSearch: boolean = true;

  cellValue;
  rowIndex;
  modalRef: BsModalRef;

  page;
  pageSize = 5;
  total;
  totalPage;
  currentPage = 1;

  body = {
    id:null,
    descriptionUse:null,
    promptName:null,
    createUsername:null,
    promptTypeName:null
  }


  constructor(
    private changeDetechtorRef: ChangeDetectorRef,
    private clickLikeService: ClickLikeService,
    public dialogRef: MatDialogRef<ViewDetailPromptComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    console.log(data);
    this.body = data;
    this.buildColumnDefs();
  }

  ngOnInit() {
    this.listUsernameLikes(0);
  }

  agInit(params ): void {
    this.cellValue = params.data;
    this.rowIndex = +params.rowIndex + 1;
  }

  refresh(params) {
    // set value into cell again
    return true
  }

  buildColumnDefs(){
    this.columnDefs = [
      {
        headerName: 'STT',
        headerTooltip: 'STT',
        lockPosition: true,
        suppressMovable: true,
        field: '',
        minWidth: 60,
        maxWidth: 48,
        headerClass: 'grid-title',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          // top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          // textAlign: 'center',
          'justify-content': 'center',
        },
        valueGetter: (param) => {
          return param.node.rowIndex + ((this.currentPage - 1) * this.pageSize + 1)
        },
      },
      {
        headerName:  'Người like',
        headerTooltip: 'Người like',
        field: 'usernameLike',
        headerClass: 'grid-title center date-custom',
        suppressMovable: true,
        minWidth: 250,
        maxWidth: 250,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'justify-content': 'center',
          top: '0px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'usernameLike',
      },
      {
        headerName: 'Ngày like',
        headerTooltip: 'Ngày like',
        field: 'createDate',
        headerClass: 'grid-title center m-l-5 date-custom',
        suppressMovable: true,
        minWidth: 250,
        maxWidth: 250,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          'justify-content': 'center',
          top: '0px',
          'margin-top': '-36px',
          'text-align': 'center',
          'white-space': 'break-spaces'
        },
        tooltipValueGetter: (param) => {
          if(param.data.createDate){
            const time = moment(param.data.createDate).format('DD/MM/YYYY hh:mm:ss');
            return time;
          }
        },
        cellRenderer: (param) => {
          var temDiv = document.createElement("div");
          var dateDiv = document.createElement("div");
          var timeDiv = document.createElement("div");
          if (param.value) {
            var date = new Date(param.value);
            dateDiv.innerText = this.formatDate(param.value);
            timeDiv.innerText = moment(date).format("HH:mm:ss");
            temDiv.appendChild(dateDiv);
            temDiv.appendChild(timeDiv);
          } else {
            temDiv.innerText = "-";
          }
          return temDiv;
        },
      },
    ];
  }


  listUsernameLikes(page){
    const data = {
      promptId: this.body.id,
      page: page,
      pageSize: this.pageSize
    }
    this.currentPage = page;
    this.clickLikeService.listUsernameClickLike(data).subscribe(res=>{
      this.rowData = res.data.content;

      this.total = res?.data?.totalElements;
      this.totalPage = res?.data?.totalPages;

      if (this.rowData.length === 0) {
        this.gridApi.setDomLayout('normal');
      } else {
        this.gridApi.setDomLayout('autoHeight');
      }
  
      this.changeDetechtorRef.detectChanges();
    })
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    changeWidthAgCenterColsContainerStyleHasMinWidth(1160,8);
    this.changeDetechtorRef.detectChanges();
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
    changeWidthAgCenterColsContainerStyleHasMinWidth(1160,8);
    this.changeDetechtorRef.detectChanges();
  }

  formatDate(originalDate: string): string {
    const date = new Date(originalDate);
    return `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  }



}
