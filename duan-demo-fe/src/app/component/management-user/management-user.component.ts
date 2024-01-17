import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { UserSearch } from 'src/app/_model/user-search';
import { UserService } from 'src/app/_service/user-service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateUpdateUserComponent } from './create-update-user/create-update-user.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Action } from 'src/app/_model/action.model';
import { CommonFunction } from 'src/app/utils/common-function';

@Component({
  selector: 'app-management-user',
  templateUrl: './management-user.component.html',
  styleUrls: ['./management-user.component.scss']
})
export class ManagementUserComponent implements OnInit {

  modalRef: BsModalRef;

  listStatus = [
    {
      name: 'Tất cả',
    },
    {
      id: 1,
      name: 'Active',
      color: '#52BD94'
    },
    {
      id: 0,
      name: 'Inactive',
      color: '#D14343'
    },
  ];

  userSearch: UserSearch = new UserSearch();
  lstUser: any;
  action: Action = new Action();

  page;
  pageSize = 10;
  total;
  totalPage;
  currentPage = 1;

  constructor(
    private userService: UserService,
    private matDialog: MatDialog,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.action = CommonFunction.getActionOfFunction('QLU')
    this.searchUser(1);
  }

  
  objSearch: any = {};
  searchUser(page){
    this.objSearch = {
      data: {
        status: this.userSearch.status,
        keySearch: this.userSearch.keySearch
      },
      page: page - 1,
      pageSize: this.pageSize
    }

    this.currentPage = page;
    console.log(this.currentPage + ">>>>currentPage");
    console.log(page + ">>>>page");
    this.userService.searchUser(this.objSearch).subscribe(
      (res:any) => {
       this.lstUser = res.data.data
       
       this.total = res?.data?.total;
       this.totalPage = res?.data?.totalPage;

       this.changeDetectorRef.detectChanges();
      },
      (error) => {
      }
    );

  }

  openFormCreate(){
    this.matDialog
      .open(CreateUpdateUserComponent, {
        width: "850px",
        maxHeight: "90vh",
        maxWidth: "90vw",
        // data: object,
        panelClass: "school-year",
        autoFocus: false,
      })
      .afterClosed().subscribe((resp) => {
        this.searchUser(1);
      });
  }


  userDetail = {
      id: null,
      username: null,
      fullname: null,
      phone: null,
      email: null,
      status: null,
      role: null,
  }
  openModalUpdate(id){
    // const dataEdit = this.cellValue;

    this.userService.viewDetailUser(id).subscribe(
      (res:any) => {
        this.userDetail = res.data;

        this.matDialog.open(
          CreateUpdateUserComponent,{
            width: "850px",
            maxHeight: "90vh",
            maxWidth: "90vw",
            data: this.userDetail,
            panelClass: "school-year",
            autoFocus: false,
          }
        ).afterClosed().subscribe((res) => {
          this.searchUser(1);
        });
        this.changeDetectorRef.detectChanges();
      },
      (error) => {
      }
    );

   
  }

  openModalDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'delete-popup-user' })
    );
  }

  deleteUser(id){
    this.userService.deleteUser(id).subscribe(
      (res:any) => {
        if(res.success == 200){
          this.toastr.success("Xóa user thành công");
          this.changeDetectorRef.detectChanges();
          this.searchUser(1);
        }
        if(res.success == 400){
          this.toastr.error(res.message);
        }
      },
      (error) => {
      }
    );
  }

}
