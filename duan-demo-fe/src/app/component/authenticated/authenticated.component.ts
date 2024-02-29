import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ChatRequest } from 'src/app/_model/chat-request.model';
import { AuthenticationService } from 'src/app/_service/auth-service/authentication.service';
import { TokenStorageService } from 'src/app/_service/token-storage-service/token-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss']
})
export class AuthenticatedComponent implements OnInit {

  chatRequest = new ChatRequest();

  listModel = [
    {
      name: "mixtral-8x7b-instruct"
    },
    {
      name: "codellama-34b-instruct"
    },
    {
      name: "bedrock"
    },
    {
      name: "gemini-pro"
    },
  ]

  constructor(
    private tokenStorageService: TokenStorageService,
    private toastr: ToastrService,
    private authService: AuthenticationService
  ) { }

  username;
  fullname;
  checkRole = false
  functionCode;

  ngOnInit() {
    this.chatRequest.model = this.listModel[0].name
    // this.username = this.tokenStorageService.getUser();
    this.fullname = this.tokenStorageService.getFullName();
    this.username = this.tokenStorageService.getUser();
    this.authen();
  }


  changModelChat(event){
    this.authService.setModelChat(event.name)
  }

  authenQLU = false;
  authenQLTASK = false;
  authenQLR = false;
  authenQLNOTE = false;
  authenQLRV = false;
  authenQLCHAT = false;
  authenQLQS = false;
  authenQLPT = false;
  authenQLFB = true;
  authen(){
    this.functionCode =  sessionStorage.getItem("functionCode");

    const parse = this.functionCode.split("|")
    for (let index = 0; index < parse.length; index++) {
      if (parse[index] === "QLU") {
        this.authenQLU = true;
      }

      if (parse[index] === "QLTASK") {
        this.authenQLTASK = true;
      }

      if (parse[index] === "QLR") {
        this.authenQLR = true;
      }

      if (parse[index] === "QLNOTE") {
        this.authenQLNOTE = true;
      }

      if (parse[index] === "QLRV") {
        this.authenQLRV = true;
      }

      if (parse[index] === "QLCHAT") {
        this.authenQLCHAT = true;
      }

      if (parse[index] === "QLQS") {
        this.authenQLQS = true;
      }

      if (parse[index] === "QLPT") {
        this.authenQLPT = true;
      }
    }
    console.log(this.authenQLU + " " + this.authenQLTASK + " " +
     this.authenQLR + " " + this.authenQLNOTE + " " + this.authenQLCHAT
      + " " + this.authenQLQS + " " +this.authenQLPT);

  }

  logout(){
    this.tokenStorageService.clearUser();
    window.location.reload();
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('functionCode');
    sessionStorage.removeItem(environment.authTokenKey);
    this.toastr.success('Đăng xuất thành công');
  }

}
