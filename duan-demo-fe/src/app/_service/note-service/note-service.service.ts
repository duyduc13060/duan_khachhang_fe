import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/_model/User';
import { environment } from '../../../environments/environment';

const AUTH_API = environment.apiUrl + "QLNOTE/note";

@Injectable({
  providedIn: 'root'
})
export class NoteServiceService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  getListNoteByUsername(user: User){
    return this.http.post(AUTH_API + '/get-list-note-by-user', user);
  }



}
