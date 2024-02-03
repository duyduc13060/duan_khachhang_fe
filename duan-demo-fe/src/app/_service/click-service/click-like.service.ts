import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const AUTH_API = environment.apiUrl + "QLCL";

@Injectable({
  providedIn: 'root'
})
export class ClickLikeService {

  constructor(
    private http: HttpClient,
  ) { }

  clickLike(data):Observable<any>{
    return this.http.post(AUTH_API + "/click",data);
  }


  listUsernameClickLike(data):Observable<any>{
    return this.http.post(AUTH_API + "/list-like",data);
  }

  viewDetail(data):Observable<any>{
    return this.http.post(AUTH_API + "/view-detail-like",data);
  }

  countNumberLike(data):Observable<any>{
    return this.http.post(AUTH_API + "/count-like",data);
  }

}
