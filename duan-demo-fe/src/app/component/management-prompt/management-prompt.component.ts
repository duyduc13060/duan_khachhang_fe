import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgbCalendar, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Action } from 'src/app/_model/action.model';
import { DateModel } from 'src/app/_model/date.model';
import { Prompt } from 'src/app/_model/prompt';
import { ClickLikeService } from 'src/app/_service/click-service/click-like.service';
import { PromptService } from 'src/app/_service/prompt-service/prompt.service';
import { PromptTypeService } from 'src/app/_service/prompt-type/prompt-type.service';
import { changeWidthAgCenterColsContainerStyleHasMinWidth } from 'src/app/helpers/utils';
import { CommonFunction } from 'src/app/utils/common-function';
import { ActionPromptManageComponent } from './action-prompt-manage/action-prompt-manage.component';
import { ClickLikePromptComponent } from './click-like-prompt/click-like-prompt.component';
import { CreateUpdatePromptComponent } from './create-update-prompt/create-update-prompt.component';
import { ViewDetailPromptComponent } from './view-detail-prompt/view-detail-prompt.component';

@Component({
  selector: 'app-management-prompt',
  templateUrl: './management-prompt.component.html',
  styleUrls: ['./management-prompt.component.scss']
})
export class ManagementPromptComponent implements OnInit {

  columnDefs;
  rowData;
  headerHeight = 48
  rowHeight = 94
  gridApi;
  gridColumnApi;
  isShowSearch: boolean = true;

  action: Action = new Action();

  listPromptType;
  prompt: Prompt = new Prompt();

  page;
  pageSize = 10;
  total;
  totalPage;
  currentPage = 1;

  constructor(
    private changeDetechtorRef: ChangeDetectorRef,
    private promptService: PromptService,
    private promptServiceType: PromptTypeService,
    private matDialog: MatDialog,
    private calendar: NgbCalendar,
    private clickLikeService: ClickLikeService
  ) {
    this.rowData = [];
    this.buildColumnDefs();
  }

  ngOnInit() {
    this.action = CommonFunction.getActionOfFunction('QLPT')

    this.getAllPromptType();
    this.searchPrompt(1);
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
        headerName:  'Loại',
        headerTooltip: 'Loại',
        field: 'promptTypeName',
        suppressMovable: true,
        headerClass: 'grid-title',
        minWidth: 102,
        maxWidth: 120,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '0px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'text-align': 'center',
          'cursor': 'pointer',
        },
        tooltipField: 'promptTypeName',
        onCellClicked: this.openPopupViewDetailPrompt.bind(this),
      },
      {
        headerName:  'Cách sử dụng',
        headerTooltip: 'Cách sử dụng',
        field: 'descriptionUse',
        suppressMovable: true,
        headerClass: 'grid-title',
        minWidth: 200,
        // maxWidth: 200,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '0px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'cursor': 'pointer',
        },
        tooltipField: 'descriptionUse',
        // cellRendererFramework: ViewDetailPromptComponent
        onCellClicked: this.openPopupViewDetailPrompt.bind(this),
      },
      {
        headerName:  'Nội dung prompt',
        headerTooltip: 'Nội dung prompt',
        field: 'promptName',
        suppressMovable: true,
        headerClass: 'grid-title',
        minWidth: 200,
        cellClass: 'grid-cell-centered',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '0px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'cursor': 'pointer',
        },
        onCellClicked: this.openPopupViewDetailPrompt.bind(this),
        toolTipField: 'promptName',
        tooltipValueGetter: (param) => {
          return param.data.promptName;
        },
      },
      {
        headerName:  'Người đóng góp',
        headerTooltip: 'Người đóng góp',
        field: 'createUsername',
        headerClass: 'grid-title center',
        suppressMovable: true,
        minWidth: 150,
        maxWidth: 150,
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
          'cursor': 'pointer',
        },
        onCellClicked: this.openPopupViewDetailPrompt.bind(this),
        tooltipField: 'createUsername',
      },
      {
        headerName: 'ngày tạo',
        headerTooltip: 'ngày tạo',
        field: 'createDate',
        headerClass: 'grid-title center m-l-5 date-custom',
        suppressMovable: true,
        minWidth: 140,
        maxWidth: 100,
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
      {
        headerName: 'ngày cập nhật',
        headerTooltip: 'ngày cập nhật',
        field: 'updateDate',
        headerClass: 'grid-title center m-l-5 date-custom',
        suppressMovable: true,
        minWidth: 140,
        maxWidth: 140,
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
          if(param.data.updateDate){
            const time = moment(param.data.updateDate).format('DD/MM/YYYY hh:mm:ss');
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
      {
        headerName: 'Số like',
        headerTooltip: 'Số like',
        field: 'numberLike',
        headerClass: 'grid-title center',
        suppressMovable: true,
        minWidth: 70,
        maxWidth: 70,
        cellStyle: (param) => {
          return {
            'font-weight': '500',
            'font-size': '12px',
            'align-items': 'center',
            display: 'flex',
            'justify-content': 'center',
            top: '0px',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            overflow: 'hidden',
          };
        },
        // tooltipValueGetter: (param) => {
        //   const { name } = this.listStatus[param.data.status];
        //   return name;
        // },
        // valueGetter: (param) => {
        //   if (param.data.numberLike == null) {
        //     return 0;
        // } else {
        //     return param.data.numberLike;
        // }
        // },
        cellRendererFramework: ClickLikePromptComponent
      },
      {
        headerName: '',
        field: 'undefined',
        // pinned: 'right',
        suppressMovable: true,
        cellClass: 'cell-action',
        cellRendererFramework: ActionPromptManageComponent,
        minWidth: 48,
        maxWidth: 48,
        // hide: this.checkNotEdit(),
        cellStyle: {
          transform: 'translateX(10px)',
        },
      },
    ];
  }

  openPopupViewDetailPrompt(event) {
    console.log(event);
    const data = event.data;
    this.matDialog.open(ViewDetailPromptComponent, {
      data: data,
      disableClose: false,
      hasBackdrop: true,
      width: '700px',
      maxHeight: '80vh',
      autoFocus: false,
      panelClass: 'view-detail-prompt'
    }).afterClosed();
  }


  getAllPromptType(){
    const listItem = {
      id: null,
      name: "Tất cả"
    }
    this.promptServiceType.getAll().subscribe(res =>{
      const list: any[] = JSON.parse(JSON.stringify(res.data));
      const hasNullSubjectId = list.some(item => item.id === null);
      if (!hasNullSubjectId) {
        list.unshift(listItem);
      }
      this.listPromptType = list;
    })

  }


  openFormCreate(){
    this.matDialog.open(
      CreateUpdatePromptComponent,{
        maxHeight: '90vh',
        disableClose: false,
        panelClass:'list-trans-seller',
        hasBackdrop: true,
        width: '760px',
        autoFocus: false,
      }
    ).afterClosed().subscribe((res) => {
      console.log(res);
      this.searchPrompt(1);
    });
  }

  clear(){
    this.prompt.createDate = null;
    // this.feedbackTimeStart = null;
    // this.showErrFromDate = false;
    // this.showErrFromDateSmaller = false;
    // this.showErrToDateSmaller = false;
  }

  selectToday(datepicker: NgbInputDatepicker) {
    this.prompt.createDate = this.calendar.getToday();
    datepicker.navigateTo();

  }

  removeTabIndex(d: NgbInputDatepicker) {
    d.toggle();
    const listElement = Array.from(document.getElementsByClassName('ngb-dp-day'));
    listElement?.forEach((item) => {
      item.removeAttribute('tabindex')
    })
    setTimeout(() =>{
      if (this.prompt.createDate) {
        this.getElementAndReSetWidth(this.prompt.createDate);
      }else{
        // this.getElementAndReSetWidth(this.calendar.getToday().month);
      }
      if (this.prompt.createDate) {
        this.getElementAndReSetWidth(this.prompt.createDate);
      }
    },500)
  }

  getElementAndReSetWidth(dateValue) {
    console.log(dateValue);
    this.checkMonthAndSetWidth(dateValue)
  }

  checkMonthAndSetWidth(date: DateModel) {
    const customSelectOne = document.getElementsByClassName('custom-select')[0] as HTMLElement;
    switch (date.month) {
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 10:
        customSelectOne.classList.add('custom-width-daterange__select-default')
        break;
      default:
        customSelectOne.classList.add('custom-width-daterange__select-fitcontent')

    }
  }

  searchPrompt(page){

    const data = {
      promptTypeId: this.prompt.promptTypeId,
      promptName: this.prompt.keySearch,
      searchDate: parseDate2(this.prompt.createDate),
      page: page - 1,
      pageSize: this.pageSize
    }

    this.currentPage = page;
    console.log(this.currentPage + ">>>>currentPage");
    console.log(page + ">>>>page");
    this.promptService.searchPrompt(data).subscribe(res=>{
      this.rowData = res?.data?.content;

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

  showErr = false;
  messageErr;
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth() + 1;
  day = this.now.getDate();
  dateObj :DateModel = new DateModel(this.year, this.month, this.day);


  changeApplyDateInput(event?) {
    console.log('event', event);
    if(event && event !=='error'){
      // this.prompt.createDate = (event.year+'-'+event.month+'-'+event.day)

      this.dateObj  = event;

    }else{
      this.prompt.createDate = '';
    }

    if(event === 'error'){
      this.showErr = true;
    }else {
      this.showErr = false;
    }
  }

  isEmptyObj(data: DateModel) {
    return !data?.year && !data?.month && !data?.day && data !== undefined;
  }

}


export function parseDate2(date2: { day, month, year }, format: string = 'yyyy/MM/dd'): string {
  if (!date2) return null
  const {day, month, year} = date2
  return formatDate(`${year}/${month}/${day}`, format, 'en_US')
}
