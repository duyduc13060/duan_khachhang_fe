import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_service/auth-service/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_model/User';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.scss']
})
export class RegisterAccountComponent implements OnInit {

  user: User = new User();
  rePassword: string;

  password = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    // Validators.pattern(
    //   /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    // ),
  ]);
  confirmPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    // Validators.pattern(
      // /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    // ),
  ]);
  ResgisterUser = this.fb.group({
    "userName":["",[Validators.required]],
    "fullName":["",[Validators.required]],
    "phoneNumber":["",[Validators.required,Validators.pattern('(0)\d{9}')]],
    password:this.password,
    rePassword:this.confirmPassword
    }
    ,
    {
      validators : this.ConfirmedValidator('password','rePassword'),
    }
  );

  constructor(
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {

  }



  registerAccount(){
    if (this.rePassword != this.user.password) {
      this.toastr.warning('Mật khẩu nhập lại không giống với mật khẩu đã nhập!');
    } else {
      this.authService.registerAccount(this.user)
      .subscribe(res => {
        this.toastr.success('Đăng Ký Thành Công!');
        sessionStorage.removeItem("email");
        this.router.navigate(["login"]);
      },
      error => this.toastr.error('Đăng ký Thất Bại :((!'));
    }
  }

  get form(){
    return this.ResgisterUser.controls;
  }


  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
