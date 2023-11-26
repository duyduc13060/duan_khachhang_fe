import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/_service/token-storage-service/token-storage.service';

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss']
})
export class AuthenticatedComponent implements OnInit {

  constructor(
    private tokenStorageService: TokenStorageService,
  ) { }

  ngOnInit() {
  }

  logout(){
    this.tokenStorageService.clearUser();
      window.location.reload();
  }

}
