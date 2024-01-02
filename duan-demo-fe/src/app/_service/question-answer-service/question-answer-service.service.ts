import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const AUTH_API = 'http://localhost:8084/api/QLQS';

@Injectable({
  providedIn: 'root'
})
export class QuestionAnswerServiceService {

  constructor(
    private http: HttpClient,
  ) { }

  uploadFile(formData: FormData){
    return this.http.post(AUTH_API + '/import/upload',formData);
  }


}
