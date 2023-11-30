import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSearch } from 'src/app/_model/user-search';

const AUTH_API = 'http://localhost:8084/api/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  

constructor(
  private http: HttpClient,
) { }

searchUser(userSearch: UserSearch): Observable<any>{
  return this.http.post(AUTH_API + '/search',userSearch);
}

}
