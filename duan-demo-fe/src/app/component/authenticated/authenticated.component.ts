import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/_service/token-storage-service/token-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss']
})
export class AuthenticatedComponent implements OnInit {

  constructor(
    private tokenStorageService: TokenStorageService,
    private toastr: ToastrService
  ) { }

  username;
  role;
  checkRole = false

  ngOnInit() {
    this.username = this.tokenStorageService.getUser();
    this.role = this.tokenStorageService.getUserRole();
  }

  logout(){
    this.tokenStorageService.clearUser();
      window.location.reload();
      this.toastr.success('Đăng xuất thành công');
  }

}
