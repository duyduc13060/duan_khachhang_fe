import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8084/api/QLRV';
@Injectable({
  providedIn: 'root'
})
export class ReviewServiceService {

constructor(
  private http: HttpClient,
) { }

  createReview(data:any):Observable<any>{
    return this.http.post(AUTH_API + '/create',data);
  }

  getListReviewUser(username: string, userrole: string): Observable<any>{
    return this.http.post<any>(AUTH_API + '/get-list-reviews', {username, userrole});
}

}
