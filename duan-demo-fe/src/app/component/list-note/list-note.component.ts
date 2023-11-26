import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Note } from 'src/app/_model/Note';
import { User } from 'src/app/_model/User';
import { NoteServiceService} from 'src/app/_service/note-service/note-service.service';
import { TokenStorageService } from 'src/app/_service/token-storage-service/token-storage.service';

@Component({
  selector: 'app-list-note',
  templateUrl: './list-note.component.html',
  styleUrls: ['./list-note.component.scss']
})
export class ListNoteComponent implements OnInit {
  

  public user: any = {};
  username;

  listNoteByUsername : Note[];


  constructor(
    private noteService: NoteServiceService,
    private tokenService: TokenStorageService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { 
    
  }

  ngOnInit() {
    this.getListNoteByUsername();
  }


  getListNoteByUsername(){

    // lay username tu localStorage
    this.username = this.tokenService.getUser();

    this.user = {
      username: this.username
    }
    
    this.noteService.getListNoteByUsername(this.user).subscribe(
      (res:any) => {
        this.listNoteByUsername = res;
        console.log(this.listNoteByUsername + ">>>>>>>>>>");
        
        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        console.error("Error getting list of notes:", error);
      }
    );

    
  }


}
