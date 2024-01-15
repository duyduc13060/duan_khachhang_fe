import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const AUTH_API = 'http://localhost:8084/api/QLPTT';
@Injectable({
  providedIn: 'root'
})
export class PromptTypeService {

  constructor(
    private http: HttpClient,
  ) { }

  getAll():Observable<any>{
    return this.http.get(AUTH_API + "/get-all");
  }

}
