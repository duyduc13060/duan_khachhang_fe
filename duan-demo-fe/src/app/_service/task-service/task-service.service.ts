import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/_model/User';
import { environment } from '../../../environments/environment';

const AUTH_API = environment.apiUrl + "QLTASK/task";

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
