import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ValidateInput } from 'src/app/_model/validate-input.model';
import { RolesService } from 'src/app/_service/role-service/roles.service';
import { CommonFunction } from 'src/app/utils/common-function';
import { CommonServiceService } from 'src/app/utils/common-service.service';

@Component({
  selector: 'app-create-update-roles',
  templateUrl: './create-update-roles.component.html',
  styleUrls: ['./create-update-roles.component.scss']
})
export class CreateUpdateRolesComponent implements OnInit {

  listStatus = [
    {
      id: 1,
      name:'ACTIVE',
      color: '#52BD94'
    },
    {
      id: 0,
      name: 'INACTIVE',
      color: '#D14343'
    },
  ]
  body = {
    id: null,
    code: null,
    name: null,
    nameEn: null,
    nameLa: null,
    description: null,
    status: 1,
    listFunctions: null
  }

  listFunctions=[]
  isUpdate = false

  validCode:ValidateInput = new ValidateInput();
  validName:ValidateInput = new ValidateInput();

  totalRecord = 0;
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  pageSize = 10;
  page;
  rangeWithDots: any[];
  hasFunction=false
  listAction = []
  // lang= localStorage.getItem('language')

  constructor(
    private changeDetechtorRef: ChangeDetectorRef,
    private commonService: CommonServiceService,
    private matDialog: MatDialog,
    public dialogRef: MatDialogRef<CreateUpdateRolesComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toaStr : ToastrService,
    private rolesManagerService: RolesService
  ) {

    this.isUpdate = false
    if(data !== null){
      this.isUpdate = true
      this.body = data
      this.listAction = this.body.listFunctions[0].listActions
      for(let i=0;i<this.body.listFunctions.length;i++){
        this.body.listFunctions[i].countClick = 0
        if(this.body.listFunctions[i].listActionSelected.length === this.body.listFunctions[i].listActions.length){
          this.body.listFunctions[i].listActionSelected.unshift(0)
        }

        this.body.listFunctions[i].listActions.unshift(
          {
              id:0,
              code: 'all',
              name: 'Tất cả',
              // nameEN: this.translateService.instant('ROLES_MANAGER.ALL'),
              // nameLA: this.translateService.instant('ROLES_MANAGER.ALL')
           }
          )

        // if(this.currentLanguage === 'VN'){
        //   this.body.listFunctions[i].listActions.unshift({id:0,code: 'all',name: 'Tất cả'})
        // }else if(this.currentLanguage === 'EN'){
        //   this.body.listFunctions[i].listActions.unshift({id:0,code: 'all',nameEn: 'All'})
        // }else if(this.currentLanguage === 'LA'){
        //   this.body.listFunctions[i].listActions.unshift({id:0,code: 'all',nameLa: 'ທັງໝົດ'})
        // }
      }
    }
  }

  ngOnInit(): void {
    if(!this.isUpdate){
      this.getAllFunction(1)
    }else{
      this.paging(1)
    }
  }


  submit(){
    this.body.code = CommonFunction.trimText(this.body.code)
    this.body.name = CommonFunction.trimText(this.body.name)
    this.body.description = CommonFunction.trimText(this.body.description)
    this.validCode = CommonFunction.validateInputUTF8Space(this.body.code, 50, null, true, true)
    this.validName = CommonFunction.validateInput(this.body.name, 250, null)

    if(!this.validCode.done || !this.validName.done){
      return
    }
    const bodySave = {
      id: this.body.id,
      code: this.body.code.trim(),
      name: this.body.name.trim(),
      description: CommonFunction.trimText(this.body.description),
      status: this.body.status,
      listFunctions: this.body.listFunctions
    }
    this.hasFunction = false
    for(let i=0;i<this.body.listFunctions.length;i++){
      if(this.body.listFunctions[i].selected){
        this.hasFunction = true
        break;
      }
    }
    if(!this.hasFunction){
      this.toaStr.error('Gán action cho Function không được để trống')
      return
    }
    for(let i=0;i<this.body.listFunctions.length;i++){
      if(this.body.listFunctions[i].selected){
        if(this.body.listFunctions[i].listActionSelected.length ===0 ){
          this.toaStr.error('Gán action cho Function không được để trống')
          document.getElementById(`action-${this.body.listFunctions[i].id}`).style.border = '1px solid #D14343'
          document.getElementById(`action-${this.body.listFunctions[i].id}`).style.borderRadius = '5px'
          return
        }
      }
    }
    // Xóa phần tử tất cả của action function
    for(let i=0;i<bodySave.listFunctions.length;i++){
      if(bodySave.listFunctions[i].listActionSelected[0] === 0){
        bodySave.listFunctions[i].listActionSelected.shift()
      }
    }
    console.log(1, bodySave)
    console.log(this.body.listFunctions)
    if(bodySave.id == null || bodySave.id === undefined){
      this.rolesManagerService.create(bodySave).subscribe(res => {
        if(res.status === 'OK'){
          this.toaStr.success(res.message);
          this.dialogRef.close({
            event: 'add success'
          })
        }else{
          this.toaStr.error(res.message);
        }
      })
    }else{
      this.rolesManagerService.update(bodySave).subscribe(res => {
        if(res.status === 'OK'){
          this.toaStr.success(res.message);
          this.dialogRef.close({
            event: 'add success'
          })
        }else{
          this.toaStr.error(res.message);
        }
      })
    }
  }
  validateCode(){
    this.body.code = this.body.code?.toUpperCase()
    this.validCode = CommonFunction.validateInputUTF8Space(this.body.code, 50, null, true, true)
  }
  validateName(){
    this.validName = CommonFunction.validateInput(this.body.name, 250, null)
  }

  // test(){
  //   console.log('body', this.body);
  //   console.log('currentLanguage', this.currentLanguage);
  //   console.log('body', this.body.listFunctions[0]['name' + this.currentLanguage]);
  //   console.log('this.translateService.instant(\'ROLES_MANAGER.ALL\')', 'Tất cả')
  //   console.log('listAction', this.listAction);
  // }

  changeAction(item,event){
    console.log('item', item);
    console.log('event', event);
    document.getElementById(`action-${item.id}`).removeAttribute('style')
    const listActionId = [];
    let idSearch = null;
    for(let i=0;i<this.listAction.length;i++){
      if(this.listAction[i].code.toUpperCase() === 'SEARCH'){
        idSearch = this.listAction[i].id;
      }
      listActionId.push(this.listAction[i].id)
    }

    console.log('idSearch', idSearch);
    let showErr = true;
    if(event.length === 0 && item.selectedAll){
      showErr = false;
      item.selectedAll = false
    }
    if(event.find(e => e.id === 0)){
      if(item.selectedAll){
        console.log('da vao day1');
        if(item.listActionSelected.length<this.listAction.length && item.listActionSelected.length>1){
          console.log('da vao day1');
          if(item.listActionSelected.some(num => num === idSearch)){
            console.log('da vao day1');
            item.listActionSelected = item.listActionSelected.filter(i => i !== 0)
            event = event.filter(i => i.id !==0 )
            item.selectedAll = false
          }else {
            console.log('da vao day1');
            item.listActionSelected = []
            item.listActionSelected = listActionId
            item.selectedAll = true;
            this.toaStr.error('Không được xóa action tìm kiếm')
          }

          // item.listActionSelected = item.listActionSelected.filter(i => i !== 0)
          // event = event.filter(i => i.id !==0 )
          // item.selectedAll = false
        }
      }else{
        console.log('da vao day1');
        if(item.listActionSelected.length===1 ||
          (item.listActionSelected.length>1 && item.listActionSelected.length < this.listAction.length)){
          console.log('da vao day1');
          item.listActionSelected = []
          item.listActionSelected = listActionId
          item.selectedAll = true
        }
      }
    }else{
      console.log('da vao day1');
      if(item.selectedAll){
        console.log('da vao day1');
        if(event.length===this.listAction.length-1){
          console.log('da vao day1');
          item.listActionSelected = [idSearch]
          item.selectedAll = false
        }
      }else{
        console.log('da vao day1');
        if(event.length===this.listAction.length-1){
          console.log('da vao day1');
          item.listActionSelected = []
          item.listActionSelected = listActionId
          item.selectedAll = true
        }else {
          if(!item.listActionSelected.some(num => num === idSearch)){
            const listTam = JSON.parse(JSON.stringify(item.listActionSelected))
            listTam.unshift(idSearch);
            console.log('listTam', listTam);
            item.listActionSelected = listTam;
            if(showErr){
              this.toaStr.error('Không được xóa action tìm kiếm')
            }
          }
        }
      }
    }
    this.changeDetechtorRef.detectChanges()

  }

  toggleApply(item, event){
    const listActionId = []
    for(let i=0;i<this.listAction.length;i++){
      listActionId.push(this.listAction[i].id)
    }
    if(event.checked){
      item.listActionSelected = listActionId
      item.selectedAll = true
    }else{
      item.listActionSelected = []
      item.selectedAll = false
    }
  }

  openDDL(item, event){
    if(item.countClick===0){
      setTimeout(() => {
        const scrollContainer = document.querySelector('.ng-dropdown-panel-items');
        if (scrollContainer) {
          item.countClick+=1
          scrollContainer.scrollTop = 0;
        }
      }, 0);
    }
  }



  getAllFunction(page){
    this.page = page;
    this.rolesManagerService.getAllFunction().subscribe(res => {
      this.body.listFunctions = res;
      this.listAction = this.body.listFunctions[0].listActions
      for(let i=0;i<this.body.listFunctions.length;i++){
        this.body.listFunctions[i].countClick = 0
        // this.body.listFunctions[i].listActions.unshift({id:0,code: 'all',name: this.trans('ROLES_MANAGER.ALL')})

        this.body.listFunctions[i].listActions.unshift(
          {
            id:0,
            code: 'all',
            name: "Tất cả",
            // nameEN: this.translateService.instant('ROLES_MANAGER.ALL'),
            // nameLA: this.translateService.instant('ROLES_MANAGER.ALL')
          }
        )

        // if(this.currentLanguage === 'VN'){
        //   this.body.listFunctions[i].listActions.unshift({id:0,code: 'all',name: 'Tất cả'})
        // }else if(this.currentLanguage === 'EN'){
        //   this.body.listFunctions[i].listActions.unshift({id:0,code: 'all',nameEn: 'All'})
        // }else if(this.currentLanguage === 'LA'){
        //   this.body.listFunctions[i].listActions.unshift({id:0,code: 'all',nameLa: 'ທັງໝົດ'})
        // }
      }
      this.totalRecord = res.length;
      this.first = ((page -1 ) * this.pageSize) + 1;
      if(this.body.listFunctions.length - (page-1)*this.pageSize < this.pageSize){
        this.last = (page-1)*this.pageSize + (this.body.listFunctions.length - (page-1)*this.pageSize)
      }else{
        this.last = this.first + page*this.pageSize - 1;
      }
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
      // this.hide = true;
      this.changeDetechtorRef.detectChanges();
    })
  }

  // ===============================Paging=============
  changePage(pageSearch){
    this.totalRecord = this.body.listFunctions.length;
    this.first = ((pageSearch -1 ) * this.pageSize) + 1;
    if(this.body.listFunctions.length - (pageSearch-1)*this.pageSize < this.pageSize){
      this.last = (pageSearch-1)*this.pageSize + (this.body.listFunctions.length - (pageSearch-1)*this.pageSize)
    }else{
      this.last = pageSearch*this.pageSize;
    }
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
  }
  paging(pageSearch: number): void {
    if(this.page === pageSearch){
      return;
    }
    this.page = pageSearch;
    this.changePage(this.page)
    // this.getAllFunction(pageSearch);
    console.log(this.page);
  }

  prev(): void {
    this.page--;
    if (this.page < 1) {
      this.page = 1;
      return;
    }
    this.changePage(this.page)
    // this.getAllFunction(this.page);
  }

  next(): void {
    this.page++;
    if (this.page > this.totalPage) {
      this.page = this.totalPage;
      return;
    }
    this.changePage(this.page)
    // this.getAllFunction(this.page);
  }

  revoveInvalid(result){
    result.done = true
  }

  // trans(key: string) : string{
  //   return this.translateService.instant(key);
  // }

  closeModal(){
    this.dialogRef.close({event: 'cancel'});
  }


}
