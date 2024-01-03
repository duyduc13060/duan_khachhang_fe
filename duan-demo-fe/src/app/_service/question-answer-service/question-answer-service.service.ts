import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8084/api/QLQS';

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


}
