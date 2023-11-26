import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from 'src/app/_model/User';

const AUTH_API = 'http://localhost:8084/api/note';
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
