import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const AUTH_API = environment.apiUrl + "QLQS";

@Injectable({
  providedIn: 'root'
})
export class QuestionAnswerServiceService {

  constructor(
    private http: HttpClient,
  ) { }

  uploadFile(formData: FormData): Observable<any>{
    return this.http.post(AUTH_API + '/import/upload',formData);
  }

  searchEs(data:any) : Observable<any>{
    return this.http.post(AUTH_API + '/search/vector',data);
  }

  deleteDocument() : Observable<any>{
    return this.http.delete(AUTH_API + '/delete/message_index');
  }



}
