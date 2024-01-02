import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSearch } from 'src/app/_model/user-search';

const AUTH_API = 'http://localhost:8084/api/QLU';
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

  createUser(data): Observable<any>{
    return this.http.post(AUTH_API + '/create/user', data);
  }

  updateUser(data): Observable<any>{
    return this.http.put(AUTH_API + '/update/user', data);
  }

  deleteUser(idUser): Observable<any>{
    return this.http.delete(AUTH_API + "/delete/user/" + idUser) 
  }

  viewDetailUser(idUser): Observable<any>{
    return this.http.get(AUTH_API + "/detail/user/" + idUser);
  }
}
