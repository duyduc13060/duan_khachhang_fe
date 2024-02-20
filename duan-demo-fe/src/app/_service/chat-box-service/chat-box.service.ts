import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const AUTH_API = environment.apiUrl + "QLCHAT/chat-box";

const AUTH_API_CHAT = "https://api.perplexity.ai/chat/completions"

@Injectable({
  providedIn: 'root'
})
export class ChatBoxService {

  constructor(
    private http: HttpClient,
  ) { }

  genarateChatBox(data): Observable<any>{
    return this.http.post(AUTH_API + "/generate-message1", data);
  }

  getMessage(type): Observable<any>{
    return this.http.get(AUTH_API + `/get-message?type=${type}`);
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
