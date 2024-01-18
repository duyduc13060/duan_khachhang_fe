import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const AUTH_API = 'http://localhost:8084/api/QLPT';
@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor(
    private http: HttpClient,
  ) { }

  searchPrompt(data): Observable<any>{
    return this.http.post(AUTH_API + '/search/prompt',data);
  }

  createPrompt(data): Observable<any>{
    return this.http.post(AUTH_API + '/create/prompt', data);
  }

  updatePrompt(data): Observable<any>{
    return this.http.put(AUTH_API + '/update/prompt', data);
  }

  deletePrompt(idPrompt): Observable<any>{
    return this.http.delete(AUTH_API + "/delete/prompt/" + idPrompt)
  }

}
