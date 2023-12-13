import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_service/auth-service/authentication.service';
import { TokenStorageService } from 'src/app/_service/token-storage-service/token-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  roles: string[] = [];
  public user: any = {};

  loginValidate = this.formG.group({
    "userName":["",Validators.required],
    "password":["",Validators.required]
  });

  constructor(
    private tokenStorage: TokenStorageService,
    private auth: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private formG: FormBuilder
  ) { }

  ngOnInit() {
    this.user = {
      username: '',
      password: '',
    };
  }

  submitForm(): void {
    this.auth.login(this.user).subscribe((data) => {
      if (data.success) {
        if (data.data.role !== 'ADMIN' ||  data.data.role !== 'USER') {
          this.toastr.error('Tài khoản không có quyền truy cập');
        } else {
          console.log(data.data);

          this.tokenStorage.saveToken(data.data.token);
          this.tokenStorage.saveUser(data.data.username);
          this.tokenStorage.saveUser_id(data.data.id);

          const role = data.data.role;
          this.tokenStorage.saveRole(role);
          console.log(role);
          console.log(this.tokenStorage.getUserRole());
          this.toastr.success('Đăng nhập thành công');
          this.router.navigate(['/dashboard']);
        }
      } else {
        this.toastr.warning('Thông tin đăng nhập không chính xác');
      }

      if(data.success === false){
        this.toastr.warning(data.message);
      }
    });
  }

  get form(){
    return this.loginValidate.controls;
  }




}
