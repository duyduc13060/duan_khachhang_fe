import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const AUTH_API = environment.apiUrl + "QLCHAT/chat-box";

@Injectable({
  providedIn: 'root'
})
export class ChatBoxService {

  constructor(
    private http: HttpClient,
  ) { }


  getMessage(): Observable<any>{
    return this.http.get(AUTH_API + '/get-message');
  }

  send(data:any): Observable<any>{
    return this.http.post(AUTH_API + "/generate-message", data);
  }

  sendChatAmazon(data:any): Observable<any>{
    return this.http.post(AUTH_API + "/generate-message-amazon", data);
  }

  sendChatGeminiPro(data:any): Observable<any>{
    return this.http.post(AUTH_API + "/generate-message-gemini-pro", data);
  }

}
