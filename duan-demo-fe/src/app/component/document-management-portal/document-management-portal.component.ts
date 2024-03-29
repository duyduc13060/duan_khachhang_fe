import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Action } from 'src/app/_model/action.model';
import { DocumentPortalService } from 'src/app/_service/document-portal/document-portal.service';
import { QuestionAnswerServiceService } from 'src/app/_service/question-answer-service/question-answer-service.service';
import { TokenStorageService } from 'src/app/_service/token-storage-service/token-storage.service';
import { changeWidthAgCenterColsContainerStyleHasMinWidth } from 'src/app/helpers/utils';
import { ActionDocumentPortalComponent } from './action-document-portal/action-document-portal.component';
import { ViewDetailDocumentComponent } from './view-detail-document/view-detail-document.component';

@Component({
  selector: 'app-document-management-portal',
  templateUrl: './document-management-portal.component.html',
  styleUrls: ['./document-management-portal.component.scss']
})
export class DocumentManagementPortalComponent implements OnInit {

  columnDefs;
  rowData;
  headerHeight = 48
  rowHeight = 94
  gridApi;
  gridColumnApi;

  isLoading: boolean = false;

  fileName;
  fileNames: string[];
  fileImport: File;
  filesImport: FileList;
  formData;
  form: FormGroup;

  action: Action = new Action();

  username;

  page;
  pageSize = 5;
  total;
  totalPage;
  currentPage = 1;
  // Thêm một thuộc tính mới để lưu trữ giá trị nhập vào từ textbox
  documentGroup: string = '';

  constructor(
    private changeDetechtorRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private questionAnswerServiceService : QuestionAnswerServiceService,
    private formBuilder: FormBuilder,
    private documentPortalService: DocumentPortalService,
    private tokenStorageService: TokenStorageService,
    private matDialog: MatDialog,
  ) {
    this.buildColumnDefs();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      file: new FormControl(null)
    });
    this.username = this.tokenStorageService.getUser();
    this.searchCreator(1);

  }


  upload(files: FileList | null) {
    if (files && files.length > 0) {
      this.filesImport = files;
      console.log(this.filesImport);
      this.fileNames = Array.from(files).map(file => file.name);
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
          return param.node.rowIndex + ((this.currentPage - 1) * this.pageSize + 1)
        },
      },
      {
        headerName:  'Nội dung',
        headerTooltip: 'Nội dung',
        field: 'content',
        suppressMovable: true,
        headerClass: 'grid-title',
        // minWidth: 102,
        maxWidth: 900,
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
        // tooltipField: 'content',
        onCellClicked: this.openPopupViewDetailDocument.bind(this),
      },
      {
        headerName:  'Tên File',
        headerTooltip: 'Tên File',
        field: 'fileName',
        suppressMovable: true,
        headerClass: 'grid-title',
        // minWidth: 102,
        maxWidth: 400,
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
        tooltipField: 'fileName',
      },
      {
        headerName:  'Nhóm tài liệu',
        headerTooltip: 'Nhóm tài liệu',
        field: 'documentGroup',
        suppressMovable: true,
        headerClass: 'grid-title',
        // minWidth: 102,
        maxWidth: 140,
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
        tooltipField: 'documentGroup',
      },
      {
        headerName: '',
        field: 'undefined',
        // pinned: 'right',
        suppressMovable: true,
        cellClass: 'cell-action',
        cellRendererFramework: ActionDocumentPortalComponent,
        minWidth: 48,
        maxWidth: 48,
        // hide: this.checkNotEdit(),
        cellStyle: {
          transform: 'translateX(10px)',
        },
      },
    ];
  }


  openPopupViewDetailDocument(event) {
    console.log(event);
    const data = event.data;
    this.matDialog.open(ViewDetailDocumentComponent, {
      data: data,
      disableClose: false,
      hasBackdrop: true,
      width: '700px',
      maxHeight: '80vh',
      autoFocus: false,
      panelClass: 'view-detail-prompt'
    }).afterClosed();
  }

  objSearch: any = {};
  searchCreator(page){
    const data = {
      creator: this.username
    }

    this.objSearch = {
      data: {
        creator: this.username
      },
      page: page - 1,
      pageSize: this.pageSize
    }

    this.currentPage = page;
    this.questionAnswerServiceService.searchCreator(this.objSearch).subscribe(res=>{

      this.rowData = res.data.content

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


  // Phương thức để cập nhật giá trị của documentGroup từ textbox
  updateDocumentGroup(value: string) {
    this.documentGroup = value;
  }

  importFile(){
    if (this.filesImport) {
      // Kiểm tra nếu giá trị nhập vào từ textbox là rỗng
      if (!this.documentGroup) {
        this.toastr.error('Vui lòng nhập tài liệu thuộc nhóm nào');
      } else {
      Array.from(this.filesImport).forEach(file => {
        console.log('File Name:', file.name);
        console.log('File Size:', file.size);
        console.log('File Type:', file.type);

        // Tạo FormData và thêm file vào đó
        const formData = new FormData();
        formData.append('file', file);
        // Thêm biến documentGroup vào FormData
        formData.append('documentGroup', this.documentGroup);
        this.toastr.success("Upload file thành công");

        // Gửi formData đến server
        this.questionAnswerServiceService.uploadFile(formData).subscribe(
          (res:any) => {
              this.toastr.success("Upload file thành công");
              this.searchCreator(1);
          },
          (error) => {
            console.error("File is not selected.", error);
          }
        );
      });
      }
    } else {
      console.error('File is not selected.');
      this.toastr.error('File is not selected.');
    }
    this.filesImport = null;
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

  clearContent() {
    this.toastr.success('Document index was successfully deleted.');
    this.questionAnswerServiceService.deleteDocument().subscribe(
      (res:any) => {
        this.toastr.success("Upload file thành công");
      },
      (error) => {
        console.error("File is not selected.", error);
      }
    );
  }



}
