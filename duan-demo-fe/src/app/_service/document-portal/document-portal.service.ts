import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


const AUTH_API = environment.apiUrl + "QLQS";

@Injectable({
  providedIn: 'root'
})
export class DocumentPortalService {



constructor(
  private http: HttpClient,
    private router: Router,
) { }

searchPrompt(data): Observable<any>{
  return this.http.post(AUTH_API + '/search/prompt',data);
}

}
