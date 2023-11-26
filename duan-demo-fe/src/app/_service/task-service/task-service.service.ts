import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/_model/User';

const AUTH_API = 'http://localhost:8084/api/task';
@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

constructor(
  private http: HttpClient,
) { }


getListTaskByUserName(user: User){
  return this.http.post(AUTH_API + '/get-list-task-by-user', user);
}



}
