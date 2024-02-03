import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ChatRequest } from 'src/app/_model/chat-request.model';
import { ChatBoxService } from 'src/app/_service/chat-box-service/chat-box.service';
import { TokenStorageService } from 'src/app/_service/token-storage-service/token-storage.service';
import { ReviewComponent } from '../review/review.component';


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
      name: "gemini-pro"
    },
    {
      name: "mixtral-8x7b-instruct"
    },
    {
      name: "codellama-34b-instruct"
    },
    {
      name: "bedrock"
    },
  ]

  chatRequest = new ChatRequest();
  isLoading: boolean = false;
  username;

  constructor(
    private chatBoxService: ChatBoxService,
    private tokenStorageService: TokenStorageService,
    private toastr: ToastrService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
    this.username = this.tokenStorageService.getUser();
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
  listMessageBedrock;
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

    if(this.chatRequest.model === 'bedrock'){
      const request = {
        prompt: this.chatRequest.content,
        key: "ABC@123",
        max: 5000
      }

      this.chatBoxService.sendChatAmazon(request).subscribe((res:any) =>{
        if(res.status === "OK"){
          this.isLoading = false;
          this.getMessage();
          this.chatRequest.content = '';
        }else{
          this.toastr.error("co loi xay ra");
        }
      })

    }else if(this.chatRequest.model === 'gemini-pro'){
      const request = {
        contents: [
          {
            parts: [
              {
                text: this.chatRequest.content
              }
            ]
          }
        ]
      }

      this.chatBoxService.sendChatGeminiPro(request).subscribe((res:any) =>{
        if(res.status === "OK"){
          this.isLoading = false;
          this.getMessage();
          this.chatRequest.content = '';
        }else{
          this.toastr.error("co loi xay ra");
        }
      })

    }else{
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

  openFormCreate(messageId, rating){
    const data = {
      messageId: messageId,
      rating : rating
    }
    this.matDialog
      .open(ReviewComponent, {
        width: "850px",
        maxHeight: "90vh",
        maxWidth: "90vw",
        data: data,
        panelClass: "review-custom",
        autoFocus: false,
      })
      .afterClosed().subscribe((resp) => {
      });
  }

}
