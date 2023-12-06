import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ValidateInput } from 'src/app/_model/validate-input.model';
import { UserService } from 'src/app/_service/user-service/user.service';
import { CommonFunction } from 'src/app/utils/common-function';
import { ManagementUserComponent } from '../management-user.component';

@Component({
  selector: 'app-create-update-user',
  templateUrl: './create-update-user.component.html',
  styleUrls: ['./create-update-user.component.scss']
})
export class CreateUpdateUserComponent implements OnInit {

  listStatus = [
    {
      id: 1,
      name: 'Active',
      color: '#52BD94'
    },
    {
      id: 0,
      name: 'Inactive',
      color: '#D14343'
    }
  ];

  listRoles=[
    {
      id: 1,
      name: 'ADMIN',
      color: '#52BD94'
    },
    {
      id: 2,
      name: 'STAFF',
      color: '#D14343'
    },
    {
      id: 3,
      name: 'CUSTOMER',
      // color: '#D14725'
    }
  ]


  body = {
    id: null,
    username: null,
    fullname: null,
    phone: null,
    email: null,
    status: 1,
    role: null,
  }
  isUpdate = false

  validUsername:ValidateInput = new ValidateInput();
  validFullname:ValidateInput = new ValidateInput();
  validPhone:ValidateInput = new ValidateInput();
  validEmail:ValidateInput = new ValidateInput();
  validRole:ValidateInput = new ValidateInput();

  constructor(
    public dialogRef: MatDialogRef<CreateUpdateUserComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toaStr : ToastrService,
    private userService: UserService,
  ) {
    if(data !== null){
      this.isUpdate = true
      this.body = data
    }
   }

  ngOnInit() {
  }


  validateUsername(){
    this.validUsername = CommonFunction.validateInputUTF8Space(this.body.username, 50, null,true, true)
  }
  validateFullname(){
    this.validFullname = CommonFunction.validateInput(this.body.fullname, 250, null)
  }
  validatePhone(){
    this.validPhone = CommonFunction.validateInput2(this.body.phone,true, 20, null)
  }
  validateEmail(){
    this.validEmail = CommonFunction.validateInput(this.body.email, 250, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  }
  revoveInvalid(result){
    result.done = true
  }

  submit(){
    this.body.username = CommonFunction.trimText(this.body.username)
    this.body.fullname = CommonFunction.trimText(this.body.fullname)
    this.body.phone = CommonFunction.trimText(this.body.phone)
    this.body.email = CommonFunction.trimText(this.body.email)
    this.validUsername = CommonFunction.validateInputUTF8Space(this.body.username, 50, null,true, true)
    this.validFullname = CommonFunction.validateInput(this.body.fullname, 250, null)
    this.validPhone = CommonFunction.validateInput2(this.body.phone,true, 20, null)
    this.validEmail = CommonFunction.validateInput(this.body.email, 250, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    this.validRole = CommonFunction.validateInput(this.body.role, null, null)

    if(!this.validUsername.done || !this.validFullname.done || !this.validPhone.done || !this.validEmail.done || !this.validRole.done){
      return
    }

    const bodySave = {
      id: this.body.id,
      username: this.body.username.trim(),
      fullname: this.body.fullname.trim(),
      phone: this.body.phone?.trim(),
      email: this.body.email.trim(),
      status: this.body.status,
      roleId: this.body.role,
    }

    if(bodySave.id == null || bodySave.id === undefined){
      this.userService.createUser(bodySave).subscribe(res => {
        if(res.success === 200){
          this.toaStr.success(res.message);
          this.dialogRef.close({
            event: 'add success'
          })
        }else{
          this.toaStr.error(res.message);
        }
      })
    }else{
      this.userService.updateUser(bodySave).subscribe(res => {
        if(res.success === 200){
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

  closeModal(){
    this.dialogRef.close({event: 'cancel'});
  }

}
