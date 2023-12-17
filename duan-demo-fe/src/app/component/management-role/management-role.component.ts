import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RolesService } from 'src/app/_service/role-service/roles.service';
import { CreateUpdateRolesComponent } from './create-update-roles/create-update-roles.component';
import * as moment from 'moment';
import { changeWidthAgCenterColsContainerStyleHasMinWidth } from 'src/app/helpers/utils';
import { CommonServiceService } from 'src/app/utils/common-service.service';
import { ActionRolesManagerComponent } from './action-roles-manager/action-roles-manager.component';
import { CommonFunction } from 'src/app/utils/common-function';
import { Action } from 'src/app/_model/action.model';

@Component({
  selector: 'app-management-role',
  templateUrl: './management-role.component.html',
  styleUrls: ['./management-role.component.scss']
})
export class ManagementRoleComponent implements OnInit {

  columnDefs
  rowData
  headerHeight = 48
  rowHeight = 94
  gridApi
  gridColumnApi
  order = 'ASC'
  orderName = 'code'
  listStatus = [
    {
      id: 0,
      name: 'INACTIVE',
      color: '#D14343'
    },
    {
      id: 1,
      name: 'ACTIVE',
      color: '#52BD94'
    }
  ]
  listStatus1 = [
    {
      name: 'Tất cả',
    },
    {
      id: 1,
      name: 'ACTIVE',
      color: '#52BD94'
    },
    {
      id: 0,
      name: 'INACTIVE',
      color: '#D14343'
    }
  ]

  searchBody={
    status: null,
    textSearch: ''
  }

  totalRecord = 0;
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  pageSize = 20;
  page;
  rangeWithDots: any[];
  hide = false;
  action: Action = new Action();
  isShowSearch: boolean = true;
  status: any;
  checkSearch = false
  listCategory = [];
  constructor(
    private changeDetechtorRef: ChangeDetectorRef,
    private commonService: CommonServiceService,
    private matDialog: MatDialog,
    private rolesManagerService: RolesService
  ) {
    this.rowData = []
    this.buildColumnDefs()
  }

  ngOnInit(): void {
    this.action = CommonFunction.getActionOfFunction('QLR')
    this.search(1)
    this.status = {
      name: 'Tất cả',
      color: '#101840'
    };
  }

  editSearch(event: any){
    console.log('event', event);
    if(event){
      this.checkSearch = !event;
    }else {
      this.checkSearch = true;
    }
    this.changeDetechtorRef.detectChanges()
    window.scrollTo({top:0,behavior: 'smooth'});
  }

  handleSearch(){
    this.checkSearch = true
    this.listCategory = [
      {
        title: 'Trạng thái',
        value: this.status ? this.status.name : 'Tất cả',
      },
      {
        title: 'Từ khóa',
        value: this.searchBody.textSearch? this.searchBody.textSearch : '--',
      }
    ]
    this.changeDetechtorRef.detectChanges()
    this.search(1)
  }

  search(page){
    this.hide = false;
    this.page = page;
    const body={
      status:  this.searchBody.status,
      textSearch: this.searchBody.textSearch?.trim(),
      order: this.order,
      orderName: this.orderName
    }
    this.rolesManagerService.search(body,page-1,this.pageSize).subscribe(res => {
      this.hide = true;
      this.rowData = res.content;
      this.totalRecord = res.totalElements;
      this.first = ((page -1 ) * this.pageSize) + 1;
      this.last = this.first + this.rowData.length - 1;
      if (this.totalRecord % this.pageSize === 0) {
        this.totalPage = Math.floor(this.totalRecord / this.pageSize);
        this.rangeWithDots = this.commonService.pagination(
          this.page,
          this.totalPage
        );
      } else {
        this.totalPage = Math.floor(this.totalRecord / this.pageSize) + 1;
        this.rangeWithDots = this.commonService.pagination(
          this.page,
          this.totalPage
        );
      }

      if (this.rowData.length === 0) {
        this.gridApi.setDomLayout('normal');
      } else {
        this.gridApi.setDomLayout('autoHeight');
      }

      // this.hide = true;
      this.changeDetechtorRef.detectChanges();
    })
  }

  // setShowSearch() {
  //   this.isShowSearch = !this.isShowSearch;
  // }

  scrollToTop() {
    window.scroll({
      top: 0,
      behavior: 'smooth'
    })
  }

  changeStatus(e) {
    if (e) {
      this.status = e;
    } else {
      this.status = {...{
        name: 'Tất cả',
        color: '#101840'
      }};
    }
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
          return (
            param.node.rowIndex + ((this.page - 1) * this.pageSize + 1)
          );
        },
      },
      {
        headerName:  'Mã',
        headerTooltip: 'Mã',
        field: 'code',
        suppressMovable: true,
        headerClass: 'grid-title',
        // headerComponentFramework: GridSortHeaderForOrganizeExamComponent,
        headerComponentParams: {
          sort: this.onSort.bind(this),
          showSortIcon: true,
          order: this.order,
          orderName: this.orderName,
          context: this
        },
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
        },
        tooltipField: 'code',
      },
      {
        headerName:  'Tên role',
        headerTooltip: 'Tên role',
        field: 'name',
        suppressMovable: true,
        headerClass: 'grid-title',
        // headerComponentFramework: GridSortHeaderForOrganizeExamComponent,
        headerComponentParams: {
          sort: this.onSort.bind(this),
          showSortIcon: true,
          order: this.order,
          orderName: this.orderName,
          context: this
        },
        minWidth: 190,
        maxWidth: 200,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          top: '0px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'name',
      },
      {
        headerName:  'Mô tả',
        headerTooltip: 'Mô tả',
        field: 'description',
        suppressMovable: true,
        headerClass: 'grid-title',
        minWidth: 200,
        // maxWidth: 130,
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
        },
        toolTipField: 'description',
        tooltipValueGetter: (param) => {
          return param.data.description;
        },
      },
      {
        headerName:  'số user',
        headerTooltip: 'số user',
        field: 'countUser',
        headerClass: 'grid-title center',
        suppressMovable: true,
        minWidth: 100,
        maxWidth: 100,
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
        tooltipField: 'countUser',
      },
      {
        headerName: 'ngày tạo',
        headerTooltip: 'ngày tạo',
        field: 'createTime',
        headerClass: 'grid-title center',
        suppressMovable: true,
        minWidth: 100,
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
        // tooltipField: 'createTime',
        tooltipValueGetter: (param) => {
          if(param.data.createTime){
            const time = moment(param.data.createTime).format('DD/MM/YYYY hh:mm:ss');
            return time;
          }
        },
        // valueGetter: (param) => {
        //   if(param.data.createTime){
        //     const time = moment(param.data.createTime).format('DD/MM/YYYY hh:mm:ss');
        //     return time;
        //   }
        // },
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
        field: 'updateTime',
        // headerComponentFramework: GridSortTimeComponent,
        headerComponentParams: {
          sort: this.onSort.bind(this),
          showSortIcon: true,
          order: this.order,
          orderName: this.orderName,
          context: this
        },
        headerClass: 'grid-title center m-l-5',
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
        // tooltipField: 'updateTime',
        tooltipValueGetter: (param) => {
          if(param.data.updateTime){
            const time = moment(param.data.updateTime).format('DD/MM/YYYY hh:mm:ss');
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
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'status',
        headerClass: 'grid-title center',
        suppressMovable: true,
        width: 100,
        minWidth: 100,
        cellStyle: (param) => {
          const { color } = this.listStatus[param.data.status];
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
            color: color,
          };
        },
        tooltipValueGetter: (param) => {
          const { name } = this.listStatus[param.data.status];
          return name;
        },
        valueGetter: (param) => {
          const { name } = this.listStatus[param.data.status];
          return name;
        },
      },
      {
        headerName: '',
        field: 'undefined',
        // pinned: 'right',
        suppressMovable: true,
        cellClass: 'cell-action',
        cellRendererFramework: ActionRolesManagerComponent,
        minWidth: 48,
        maxWidth: 48,
        // hide: this.checkNotEdit(),
        cellStyle: {
          transform: 'translateX(10px)',
        },
      },
    ];
  }

  openModalCreate(){
    this.matDialog.open(
      CreateUpdateRolesComponent,{
        maxHeight: '90vh',
        disableClose: false,
        panelClass:'list-trans-seller',
        hasBackdrop: true,
        width: '760px',
        autoFocus: false,
      }
    ).afterClosed().subscribe((res) => {
      console.log(res);
      this.search(this.page);
    });
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


  onSort(sortMode: 'ASC' | 'DESC', columnName: string): void {
    this.orderName = columnName;
    this.order = sortMode;

    this.search(this.page);
  }

  // ===============================Paging=============
  paging(pageSearch: number): void {
    if(this.page === pageSearch){
      return;
    }
    this.page = pageSearch;
    this.search(pageSearch);
    console.log(this.page);
  }

  prev(): void {
    this.page--;
    if (this.page < 1) {
      this.page = 1;
      return;
    }
    this.search(this.page);
  }

  next(): void {
    this.page++;
    if (this.page > this.totalPage) {
      this.page = this.totalPage;
      return;
    }
    this.search(this.page);
  }

  formatDate(originalDate: string): string {
    const date = new Date(originalDate);
    return `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  }
}
