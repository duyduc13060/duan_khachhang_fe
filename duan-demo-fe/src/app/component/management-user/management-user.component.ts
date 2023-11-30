import { Component, OnInit } from '@angular/core';
import { UserSearch } from 'src/app/_model/user-search';
import { UserService } from 'src/app/_service/user-service/user.service';

@Component({
  selector: 'app-management-user',
  templateUrl: './management-user.component.html',
  styleUrls: ['./management-user.component.scss']
})
export class ManagementUserComponent implements OnInit {


  userSearch: UserSearch = new UserSearch();
  lstUser: any;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.searchUser();
  }


  searchUser(){

    this.userService.searchUser(this.userSearch).subscribe(
      (res:any) => {
       this.lstUser = res.data
      },
      (error) => {
      }
    );

  }


}
