import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const AUTH_API = environment.apiUrl + "QLPTT";

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
