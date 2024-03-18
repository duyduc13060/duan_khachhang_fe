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

  getListUserQuestion(data:any) : Observable<any>{
    return this.http.post(AUTH_API + '/get-list-user-question',data);
  }

  vectorIndexUserQuestion(data:any): Observable<any>{
    return this.http.post(AUTH_API + "/vector-index-question", data);
  }

  deleteDocument() : Observable<any>{
    return this.http.delete(AUTH_API + '/delete/message_index');
  }

  getOriginalFile(data:any) : Observable<any>{
    return this.http.post(AUTH_API + '/get/original/file', data);
  }

  searchCreator(data): Observable<any>{
    return this.http.post(AUTH_API + '/search/vector/creator',data);
  }

  deleteDocumentFilename(filename: string, documentGroup: string): Observable<any> {
    return this.http.delete(`${AUTH_API}/delete/vector/filename?filename=${filename}&documentGroup=${documentGroup}`);
  }

}
