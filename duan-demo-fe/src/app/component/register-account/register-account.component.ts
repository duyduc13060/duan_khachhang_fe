import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_service/auth-service/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_model/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.scss']
})
export class RegisterAccountComponent implements OnInit {

  user: User = new User();
  rePassword: string;

  constructor(
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router
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

}
