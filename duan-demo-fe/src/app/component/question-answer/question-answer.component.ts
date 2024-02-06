import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Action } from 'src/app/_model/action.model';
import { ChatRequest } from 'src/app/_model/chat-request.model';
import { ChatBoxService } from 'src/app/_service/chat-box-service/chat-box.service';
import { QuestionAnswerServiceService } from 'src/app/_service/question-answer-service/question-answer-service.service';
import { TokenStorageService } from 'src/app/_service/token-storage-service/token-storage.service';
import { CommonFunction } from 'src/app/utils/common-function';
import { ReviewComponent } from '../review/review.component';
import { ViewReferDocumentComponent } from '../view-refer-document/view-refer-document.component';

@Component({
  selector: 'app-question-answer',
  templateUrl: './question-answer.component.html',
  styleUrls: ['./question-answer.component.scss']
})
export class QuestionAnswerComponent implements OnInit {

  isLoading: boolean = false;
  username;
  role;
  action: Action = new Action();

  listModel = [
    {
      name: "mixtral-8x7b-instruct"
    },
    {
      name: "codellama-34b-instruct"
    },
    {
      name: "bedrock"
    },
    {
      name: "gemini-pro"
    },
  ]

  listMessage;
  chatRequest = new ChatRequest();
  private timeoutId: any;

  @ViewChild('scrollframe1', {static: false}) scrollFrame: ElementRef;
  @ViewChildren('item1') itemElements: QueryList<any>;
  private scrollContainer: any;


  constructor(
    private tokenStorageService: TokenStorageService,
    private toastr: ToastrService,
    private questionAnswerServiceService : QuestionAnswerServiceService,
    private chatBoxService: ChatBoxService,
    private matDialog: MatDialog,
  ) { }


  ngOnInit() {
    this.chatRequest.model = this.listModel[0].name
    //this.chatRequest.system = "System: Chỉ được sử dụng thông tin trong Context để trả lời yêu cầu ở cuối cùng. Nếu không biết thì trả lời là không biết. Yêu cầu trả lời hoàn toàn theo ngôn ngữ của yêu cầu ở dưới cùng."
    this.username = this.tokenStorageService.getUser();
    this.role = this.tokenStorageService.getRole();
    this.documentFileName = '';
    this.getMessage()
    this.action = CommonFunction.getActionOfFunction('QLQS')
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
  fileNames: string[];
  fileImport: File;
  filesImport: FileList;
  formData;
  form: FormGroup;
  documentFileName;
  allFileContent;

  upload(files: FileList | null) {
    if (files && files.length > 0) {
      this.filesImport = files;
      console.log(this.filesImport);
      this.fileNames = Array.from(files).map(file => file.name);
    }
}

  documentResponse:any;
  searchEs(){
    this.isLoading = true;
    const data = {
      content: this.chatRequest.content
    }
    this.questionAnswerServiceService.searchEs(data).subscribe(res=>{
      // this.documentResponse = res.length >= 7 ? res.slice(0, 7).map(item => item.document).join('') : res[0].document;
      if (res.length === 0) {
        this.isLoading = false;
        this.toastr.error('You do not upload documents! Please upload them.');
      }
      // Sắp xếp mảng theo giá trị tăng dần của trunkCount
      res.sort((a, b) => a.trunkCount - b.trunkCount);

      // Kiểm tra số lượng phần tử trong mảng và lấy ra content tương ứng
      if (res.length >= 3) {
        this.documentResponse = res[0].content + res[1].content + res[2].content;
      } else if (res.length === 2) {
        this.documentResponse = res[0].content + res[1].content;
      } else if (res.length === 1) {
        this.documentResponse = res[0].content;
      }
      this.documentFileName = res[0].fileName;
      this.timeoutId = setTimeout(() => {
        this.sendChatBox(this.documentResponse);
      }, 1000);
    })
  }

  clearContent() {
    this.toastr.success('Document index was successfully deleted.');
    this.questionAnswerServiceService.deleteDocument().subscribe(
      (res:any) => {
        this.toastr.success("Upload file thành công");
      },
      (error) => {
        console.error("File is not selected.", error);
      }
    );
  }

  importFile(){
    if (this.filesImport) {
      Array.from(this.filesImport).forEach(file => {
        console.log('File Name:', file.name);
        console.log('File Size:', file.size);
        console.log('File Type:', file.type);

        // Tạo FormData và thêm file vào đó
        const formData = new FormData();
        formData.append('file', file);
        this.toastr.success("Upload file thành công");

        // Gửi formData đến server
        this.questionAnswerServiceService.uploadFile(formData).subscribe(
          (res:any) => {
              this.toastr.success("Upload file thành công");
          },
          (error) => {
            console.error("File is not selected.", error);
          }
        );
      });
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


    if(this.chatRequest.model === 'bedrock'){
      const request = {
        prompt: "Only use the following pieces of context to provide a concise answer in Vietnamese to the question at the end. If you don't know the answer or don't have information in the context, just say that you don't know, don't try to make up an answer " + "{Context} " + this.chatRequest.context + " " + documentResponse + " {End}. <br><b>Question: " + this.chatRequest.content +"</b>",
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
                text: "Only use the following pieces of context to provide a concise answer in Vietnamese to the question at the end. If you don't know the answer or don't have information in the context, just say that you don't know, don't try to make up an answer " + "{Context} " + this.chatRequest.context + " " + documentResponse + " {End}. <br><b>Question: " + this.chatRequest.content +"</b>"
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
            content: "Only use the following pieces of context to provide a concise answer in Vietnamese to the question at the end. If you don't know the answer or don't have information in the context, just say that you don't know, don't try to make up an answer. Xuống dòng ở cuối câu trả lời và trả lời thông tin sau: thông tin context đó có ở trang bao nhiêu của tài liệu: " + this.documentFileName
          },
          {
            role: "user",
            content: "{Context} " + this.chatRequest.context + " " + documentResponse + " {End}.<br><b>Question: " + this.chatRequest.content +"</b>"
          },
        ],
        max_tokens: 20000,
        temperature: 0
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

  getMessage(){
    this.chatBoxService.getMessage().subscribe(res =>{
      this.listMessage = res;
      console.log(this.listMessage);
    })
  }

  openPdfViewer(){
    const data = {
      filename: this.documentFileName,
    }
    this.matDialog
     .open(ViewReferDocumentComponent, {
        width: "850px",
        maxHeight: "90vh",
        maxWidth: "90vw",
        data: data,
        panelClass: "pdf-viewer-custom",
        autoFocus: false,
      })
     .afterClosed().subscribe((resp) => {
      });
  }

  clickRefer(data : any){
    this.questionAnswerServiceService.getOriginalFile(data).subscribe(res =>{
    // Nếu res có giá trị thì: this.allFileContent = res
    if (res) {
      this.allFileContent = res;
      console.log(this.allFileContent); // In giá trị của allFileContent
    }
  }, err => {
    // Nếu không thì báo lỗi
    console.error('Có lỗi xảy ra:', err);
  });
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
