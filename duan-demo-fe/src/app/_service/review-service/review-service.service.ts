import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const AUTH_API = environment.apiUrl + "QLRV";

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

  deleteReview(reviewId): Observable<any>{
    return this.http.delete(AUTH_API + "/delete/review/" + reviewId)
  }

}
