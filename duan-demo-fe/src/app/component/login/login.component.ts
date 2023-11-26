import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_service/auth-service/authentication.service';
import { TokenStorageService } from 'src/app/_service/token-storage-service/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  roles: string[] = [];
  public user: any = {};

  constructor(
    private tokenStorage: TokenStorageService,
    private auth: AuthenticationService,
    private router: Router,
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
        if (data.data.role[0].authority === 'CUSTOMER') {
          console.log('Tài khoản không có quyền truy cập');
        } else {
          console.log(data.data);

          this.tokenStorage.saveUser(data.data.username);
          this.tokenStorage.saveUser_id(data.data.id);
          const role = data.data.role[0].authority;
          this.tokenStorage.saveRole(role);
          console.log(role);
          console.log(this.tokenStorage.getUserRole());

          console.log('Đăng nhập thành công');
          this.router.navigate(['/dashboard']);
        }
      } else {
        console.log('Thông tin đăng nhập không chính xác');
      }
    });
  }

}
