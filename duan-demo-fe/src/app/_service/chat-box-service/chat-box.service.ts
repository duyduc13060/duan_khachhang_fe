import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const AUTH_API = 'http://localhost:8084/api/chat-box';

@Injectable({
  providedIn: 'root'
})
export class ChatBoxService {

  constructor(
    private http: HttpClient,
  ) { }


  send(data:any){
    return this.http.post(AUTH_API + "/generate-message", data);
  }



}
