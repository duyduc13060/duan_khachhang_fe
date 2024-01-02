import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/_service/token-storage-service/token-storage.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

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
  checkRole = false

  ngOnInit() {
    this.username = this.tokenStorageService.getUser();
  }

  logout(){
    this.tokenStorageService.clearUser();
    window.location.reload();
    sessionStorage.removeItem('role');
    sessionStorage.removeItem(environment.authTokenKey);
    this.toastr.success('Đăng xuất thành công');
    

  }

}
