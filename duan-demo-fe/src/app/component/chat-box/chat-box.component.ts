import { Component, OnInit } from '@angular/core';
import { ChatBoxService } from 'src/app/_service/chat-box-service/chat-box.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {

  constructor(
    private chatBoxService: ChatBoxService
  ) { }

  ngOnInit() {
  }


  

}
