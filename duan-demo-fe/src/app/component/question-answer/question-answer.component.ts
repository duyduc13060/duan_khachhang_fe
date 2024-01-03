import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Action } from 'src/app/_model/action.model';
import { ChatRequest } from 'src/app/_model/chat-request.model';
import { ChatBoxService } from 'src/app/_service/chat-box-service/chat-box.service';
import { QuestionAnswerServiceService } from 'src/app/_service/question-answer-service/question-answer-service.service';
import { TokenStorageService } from 'src/app/_service/token-storage-service/token-storage.service';
import { CommonFunction } from 'src/app/utils/common-function';

@Component({
  selector: 'app-question-answer',
  templateUrl: './question-answer.component.html',
  styleUrls: ['./question-answer.component.scss']
})
export class QuestionAnswerComponent implements OnInit {

  isLoading: boolean = false;
  username;

  listModel = [
    {
      name: "mistral-7b-instruct"
    },
    {
      name: "codellama-34b-instruct"
    },
  ]

  listMessage;
  chatRequest = new ChatRequest();
  private timeoutId: any;

  @ViewChild('scrollframe1', {static: false}) scrollFrame: ElementRef;
  @ViewChildren('item1') itemElements: QueryList<any>;
  private scrollContainer: any;
  action: Action = new Action();

  constructor(
    private tokenStorageService: TokenStorageService,
    private toastr: ToastrService,
    private questionAnswerServiceService : QuestionAnswerServiceService,
    private chatBoxService: ChatBoxService,
  ) { }


  ngOnInit() {
    this.action = CommonFunction.getActionOfFunction('QLQS')
    this.chatRequest.model = this.listModel[0].name
    this.username = this.tokenStorageService.getUser();
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

  fileName;
  fileImport: File;
  formData;
  form: FormGroup;

  upload(files: FileList | null) {
    if (files && files.length > 0) {
      this.fileImport = files[0];
      console.log(this.fileImport);
      this.fileName = this.fileImport.name;
    }
  }

  documentResponse:any;
  searchEs(){

    const data = {
      document: this.chatRequest.content
    }
    this.questionAnswerServiceService.searchEs(data).subscribe(res=>{
      this.documentResponse = res[0].document;

      this.timeoutId = setTimeout(() => {
        this.sendChatBox(this.documentResponse);
      }, 1000);

    })
  }


  importFile(){
    if (this.fileImport) {
      console.log('File Name:', this.fileImport.name);
      console.log('File Size:', this.fileImport.size);
      console.log('File Type:', this.fileImport.type);

      // Tạo FormData và thêm file vào đó
      const formData = new FormData();
      formData.append('file', this.fileImport);

      // Gửi formData đến server 
      this.questionAnswerServiceService.uploadFile(formData).subscribe(
        (res:any) => {
            this.toastr.success("Upload file thành công");
        },
        (error) => {
          console.error("File is not selected.", error);
        }
      );
      
    } else {
      console.error('File is not selected.');
      this.toastr.error('File is not selected.');
    }
  }

  sendChatBox(documentResponse){
    this.isLoading = true;
    if(this.chatRequest.content === null || this.chatRequest.content === '' || this.chatRequest.content == undefined){
      this.toastr.error("Ban chua nhap content truoc khi gui yeu cau");
      this.isLoading = false;
      return;
    }

    if(
      this.chatRequest.system === null || this.chatRequest.system === '' || this.chatRequest.system == undefined 
    ){
      this.chatRequest.system = '';
    }
    if(this.chatRequest.context === null || this.chatRequest.context === '' || this.chatRequest.context == undefined){
      this.chatRequest.context = '';
    }

    if(documentResponse == '' || documentResponse == null){
      documentResponse = this.chatRequest.content
    }

    const request = {
      model:this.chatRequest.model, 
      messages: [
        {
          role: "system",
          content: "Use the following pieces of context to provide a concise answer in Vietnamese to the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer"
        },
        {
          role: "user",
          content:this.chatRequest.system + " " + this.chatRequest.context + " " + documentResponse
        },
      ]
      // stream: true
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

  getMessage(){
    this.chatBoxService.getMessage().subscribe(res =>{
      this.listMessage = res;
      console.log(this.listMessage);
    })
  }

}
