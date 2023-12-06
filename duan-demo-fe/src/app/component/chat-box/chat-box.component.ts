import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ChatRequest } from 'src/app/_model/chat-request.model';
import { ChatBoxService } from 'src/app/_service/chat-box-service/chat-box.service';
import { SpinnerService } from 'src/app/_service/spinner.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit,AfterViewInit {

  @ViewChild('scrollframe', {static: false}) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;
  private scrollContainer: any;

  listModel = [
    {
      name: "mistral-7b-instruct"
    },
    {
      name: "codellama-34b-instruct"
    },
  ]

  chatRequest = new ChatRequest();
  isLoading: boolean = false;

  constructor(
    private chatBoxService: ChatBoxService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.chatRequest.model = this.listModel[0].name
    this.getMessage()
  }

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;  
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());    
  }

  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }


  listMessage;
  getMessage(){
    this.chatBoxService.getMessage().subscribe(res =>{
      this.listMessage = res;
      console.log(this.listMessage);
    })
  }


  sendChatBox(){
    this.isLoading = true;
    if(this.chatRequest.content === null || this.chatRequest.content === '' || this.chatRequest.content == undefined){
      this.toastr.error("Ban chua nhap content truoc khi gui yeu cau");
      this.isLoading = false;
      return;
    }

    const request = {
      model:this.chatRequest.model, 
      messages: [
        {
          role: "system",
          content: "Be precise and concise."
        },
        {
          role: "user",
          content: this.chatRequest.content
        },

      ]
    }

    this.chatBoxService.send(request).subscribe((res:any) =>{
      if(res.status === "OK"){
        this.isLoading = false;
        this.getMessage();
        this.chatRequest.content = '';
      }else{
        this.toastr.error("co loi xay ra");
      }
    })

  }

}
