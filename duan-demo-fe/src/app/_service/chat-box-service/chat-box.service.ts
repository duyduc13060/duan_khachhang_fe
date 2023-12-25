import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const AUTH_API = 'http://localhost:8084/api/QLCHAT/chat-box';

@Injectable({
  providedIn: 'root'
})
export class ChatBoxService {

  constructor(
    private http: HttpClient,
  ) { }


  getMessage(){
    return this.http.get(AUTH_API + '/get-message');
  }

  send(data:any){
    return this.http.post(AUTH_API + "/generate-message", data);
  }

  sendChatAmazon(data:any){
    return this.http.post(AUTH_API + "/generate-message-amazon", data);
  }



}
