import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { UserSearch } from 'src/app/_model/user-search';
import { UserService } from 'src/app/_service/user-service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateUpdateUserComponent } from './create-update-user/create-update-user.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private userService: UserService,
    private matDialog: MatDialog,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.searchUser();
  }

  searchUser(){
    const body = {
      status: this.userSearch.status,
      keySearch: this.userSearch.keySearch
    }

    this.userService.searchUser(body).subscribe(
      (res:any) => {
       this.lstUser = res.data
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
        this.searchUser();
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
          this.searchUser();
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
        this.toastr.success("Xóa user thành công");
        this.changeDetectorRef.detectChanges();
        this.searchUser();
      },
      (error) => {
      }
    );
  }

}
