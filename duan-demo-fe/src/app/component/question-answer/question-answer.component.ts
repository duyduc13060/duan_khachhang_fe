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
import Typewriter from 't-writer.js';

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
      name: "gpt-3.5-turbo"
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
    {
      name: "gemini-pro"
    },
  ]

  // listGroupDocument = [
  //   {
  //     name: "All Document"
  //   },
  // ]

  releated;
  groupDocument;
  listGroupDocument = [];
  listMessage;
  chatRequest = new ChatRequest();
  private timeoutId: any;

  @ViewChild('scrollframe1', {static: false}) scrollFrame: ElementRef;
  @ViewChildren('item1') itemElements: QueryList<any>;
  @ViewChildren('tw') typewriterElements: QueryList<any>;
  private scrollContainer: any;
  typeWriter: any;
  isFirst = true;
  constructor(
    private tokenStorageService: TokenStorageService,
    private toastr: ToastrService,
    private questionAnswerServiceService : QuestionAnswerServiceService,
    private chatBoxService: ChatBoxService,
    private matDialog: MatDialog,
  ) {
    
   }


  ngOnInit() {
    this.chatRequest.model = this.listModel[0].name
    // this.groupDocument = this.listGroupDocument[0].groupName
    //this.chatRequest.system = "System: Chỉ được sử dụng thông tin trong Context để trả lời yêu cầu ở cuối cùng. Nếu không biết thì trả lời là không biết. Yêu cầu trả lời hoàn toàn theo ngôn ngữ của yêu cầu ở dưới cùng."
    this.username = this.tokenStorageService.getUser();
    this.role = this.tokenStorageService.getRole();
    this.documentFileName = '';
    this.getMessage0();
    this.getDocumentGroupList();
    this.action = CommonFunction.getActionOfFunction('QLQS');
    
    // this.releated =  sessionStorage.getItem("releated");
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
  listFileName: string[] = [];
  listContextHighline: string[] = [];
  allFileContent;
  count = 0;
  listUserQuestion;

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
    this.documentFileName = '';
    this.documentResponse = '';
    this.listFileName = [];
    this.listContextHighline = [];
    const data = {
      content: this.chatRequest.content,
      groupDocument: this.groupDocument
    }
    this.questionAnswerServiceService.searchEs(data).subscribe(res=>{
      // this.documentResponse = res.length >= 7 ? res.slice(0, 7).map(item => item.document).join('') : res[0].document;
      if (res.length === 0) {
        this.isLoading = false;
        this.toastr.error('You do not upload documents! Please upload them.');
      }
      this.count = 0;
      this.documentResponse = '';
      for (let i = 0; i < res.length; i++) {
        if (this.count >= 9) break; // Dừng vòng lặp nếu đã đủ 9 phần tử
        this.documentResponse += res[i].fullContent;
        if (this.listFileName.length == 0)
        {
          this.listFileName.push(res[i].fileName);
          this.listContextHighline.push(res[i].fullContent);
          this.documentFileName += res[i].fileName + ' , ';
        }
        else if (!this.listFileName.includes(res[i].fileName)) {
          this.listFileName.push(res[i].fileName);
          this.listContextHighline.push(res[i].fullContent);
          this.documentFileName += res[i].fileName + ' , ';
        }
        this.count++;
      }

      this.timeoutId = setTimeout(() => {
        this.sendChatBox(this.documentResponse);
      }, 1000);
    })
  }

  documentResponse1:any;
  searchEsByRelatedQuestion(relatedQuestion){
    this.isLoading = true;
    this.documentFileName = '';
    this.documentResponse1 = '';
    this.chatRequest.content = relatedQuestion;
    this.listFileName = [];
    this.listContextHighline = [];
    const data = {
      content: relatedQuestion,
      groupDocument: this.groupDocument
    }
    this.questionAnswerServiceService.searchEs(data).subscribe(res=>{
      // this.documentResponse = res.length >= 7 ? res.slice(0, 7).map(item => item.document).join('') : res[0].document;
      if (res.length === 0) {
        this.isLoading = false;
        this.toastr.error('You do not upload documents! Please upload them.');
      }
      this.count = 0;
      this.documentResponse1 = '';
      for (let i = 0; i < res.length; i++) {
        if (this.count >= 9) break; // Dừng vòng lặp nếu đã đủ 9 phần tử
        this.documentResponse1 += res[i].fullContent;
        if (this.listFileName.length == 0)
        {
          this.listFileName.push(res[i].fileName);
          this.listContextHighline.push(res[i].fullContent);
          this.documentFileName += res[i].fileName + ' , ';
        }
        else if (!this.listFileName.includes(res[i].fileName)) {
          this.listFileName.push(res[i].fileName);
          this.listContextHighline.push(res[i].fullContent);
          this.documentFileName += res[i].fileName + ' , ';
        }
        this.count++;
      }

      this.timeoutId = setTimeout(() => {
        this.sendChatBox(this.documentResponse1);
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
    if(this.chatRequest.content === null || this.chatRequest.content === '' || this.chatRequest.content == undefined){
      this.toastr.error("Ban chua nhap content truoc khi gui yeu cau");
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
          this.getMessage0();
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
          this.getMessage0();
          this.chatRequest.content = '';
        }else{
          this.toastr.error("co loi xay ra");
        }
      })
    }
    else if(this.chatRequest.model === 'gpt-3.5-turbo'){
      const request = {
        model:this.chatRequest.model,
        messages: [
          {
            role: "system",
            content: "Chỉ sử dụng các phần thông tin liên quan tới Câu Hỏi để tạo câu trả lời đầy đủ và chi tiết bằng tiếng Việt Nam cho câu hỏi ở trên cùng. Lưu ý rằng không phải tất cả thông tin trong context đều liên quan tới câu hỏi, bạn phải chọn lọc các thông tin trong context để trả lời chi tiết cho câu hỏi ở trên cùng, những thông tin càng gần với câu hỏi ở trên cùng thì càng liên quan nhiều hơn tới câu hỏi, nếu có nhiều thông tin liên quan tới câu hỏi, thì phải trả lời đầy đủ thông tin. Nếu bạn không biết câu trả lời hoặc không có thông tin trong context, hãy nói rằng bạn không biết, đừng cố gắng tạo ra câu trả lời. Nếu bạn trả lời đầy đủ, chính xác và chi tiết thông tin cho câu hỏi, thì sẽ sớm được thăng chức lên trưởng phòng. Trích dẫn ở cuối câu trả lời rằng phần thông tin được dùng cho câu trả lời có ở trang bao nhiêu của tài liệu nào trong các tài liệu sau: " + this.documentFileName
          },
          {
            role: "user",
            content: "<b>Câu Hỏi: " + this.chatRequest.content +"</b><br>" + "{Context} " + this.chatRequest.context + " " + documentResponse + " {Context End}"
          }
        ],
        temperature: 0.01,
      }

      const data = {
        question: this.chatRequest.content,
        groupDocument: this.groupDocument
      }
      this.questionAnswerServiceService.getListUserQuestion(data).subscribe(res=>{
        if(res.length > 0){
          this.listUserQuestion = res;
        }
      })

      this.chatBoxService.sendChatGPT(request).subscribe((res:any) =>{
        if(res.status === "OK"){
          this.getMessage0();
          if (this.chatRequest.content.length >= 30){
            const data = {
              content: this.chatRequest.content,
              groupDocument: this.groupDocument
            }
            this.questionAnswerServiceService.vectorIndexUserQuestion(data).subscribe((res:any) =>{
              if(res.status === "OK"){
                console.log('Index câu hỏi thành công');
              }
            });
          }
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
            // content: "Only use the following needed pieces of context to provide a detail answer in Vietnamese to the question at the end. If you don't know the answer or don't have information in the context, just say that you don't know, don't try to make up an answer. Bắt buộc trả lời thông tin sau một cách chính xác nhất có thể: Thông tin context dùng cho câu trả lời có ở trang bao nhiêu của tài liệu nào trong các tài liệu sau đây: " + this.documentFileName
            //content: "Only use the following of context to provide the detail answer in Vietnamese to the question at the end. If you don't know the answer or don't have information in the context, just say that you don't know, don't try to make up an answer. At the end of your answer, provide information on which page and document the context is found in the following documents: " + this.documentFileName
            content: "Chỉ sử dụng các phần thông tin liên quan tới Câu Hỏi để tạo câu trả lời đầy đủ và chi tiết bằng tiếng Việt Nam cho câu hỏi ở trên cùng. Lưu ý rằng không phải tất cả thông tin trong context đều liên quan tới câu hỏi, bạn phải chọn lọc các thông tin trong context để trả lời chi tiết cho câu hỏi ở trên cùng, những thông tin càng gần với câu hỏi ở trên cùng thì càng liên quan nhiều hơn tới câu hỏi, nếu có nhiều thông tin liên quan tới câu hỏi, thì phải trả lời đầy đủ thông tin. Nếu bạn không biết câu trả lời hoặc không có thông tin trong context, hãy nói rằng bạn không biết, đừng cố gắng tạo ra câu trả lời. Nếu bạn trả lời đầy đủ, chính xác và chi tiết thông tin cho câu hỏi, thì sẽ sớm được thăng chức. Trích dẫn ở cuối câu trả lời rằng phần thông tin được dùng cho câu trả lời có ở trang bao nhiêu của tài liệu nào trong các tài liệu sau: " + this.documentFileName
          },
          {
            role: "user",
            content: "<b>Câu Hỏi: " + this.chatRequest.content +"</b><br>" + "{Context} " + this.chatRequest.context + " " + documentResponse + " {Context End}"
          },
        ],
        max_tokens: 20000,
        temperature: 0.01,
        type: 0
      }

      // const request2 = {
      //   model:this.chatRequest.model,
      //   messages: [
      //     {
      //       role: "system",
      //       content: "Be precise and concise."
      //     },
      //     {
      //       role: "user",
      //       content: "Hãy tạo cho tôi 3 câu hỏi bằng tiếng việt tương tự câu hỏi sau: " + this.chatRequest.content
      //     },
      //   ],
      //   type: 1
      // }
      const data = {
        question: this.chatRequest.content,
        groupDocument: this.groupDocument
      }
      this.questionAnswerServiceService.getListUserQuestion(data).subscribe(res=>{
        if(res.length > 0){
          this.listUserQuestion = res;
        }
      })

      this.chatBoxService.send(request).subscribe((res:any) =>{
        if(res.status === "OK"){
          this.getMessage0();
          if (this.chatRequest.content.length >= 30){
            const data = {
              content: this.chatRequest.content,
              groupDocument: this.groupDocument
            }
            this.questionAnswerServiceService.vectorIndexUserQuestion(data).subscribe((res:any) =>{
              if(res.status === "OK"){
                console.log('Index câu hỏi thành công');
              }
            });
          }
          this.chatRequest.content = '';

          // uncomment sau
          // this.chatBoxService.genarateChatBox(request2).subscribe((res:any) =>{
          //   this.isLoading = false;
          //   if(res.status === "OK"){
          //     this.chatRequest.content = '';
          //     sessionStorage.setItem('releated',res.data.choices[0].message.content);
          //     console.log(res.data.choices[0].message.content);
          //   }else{
          //     this.toastr.error("co loi xay ra");
          //   }
          // })
        }else{
          this.toastr.error("co loi xay ra");
        }
      }, error => {
        this.isLoading = false;
        console.error(error);
      });



      // this.isLoading = false;
      // this.chatBoxService.genarateChatBox(request2).subscribe((res:any) =>{
      //   this.isLoading = false;
      //   if(res.status === "OK"){
      //     // this.getMessage1();
      //     this.chatRequest.content = '';
      //     sessionStorage.setItem('releated',res.data.choices[0].message.content);
      //     console.log(res.data.choices[0].message.content);
      //   }else{
      //     this.toastr.error("co loi xay ra");
      //   }
      //   console.log(res);
      // })
    }
  }


  // documentResponse1:any;
  // searchEs1(dataR){
  //   this.isLoading = true;
  //   const data = {
  //     content: dataR
  //   }
  //   this.questionAnswerServiceService.searchEs(data).subscribe(res=>{
  //     // this.documentResponse = res.length >= 7 ? res.slice(0, 7).map(item => item.document).join('') : res[0].document;
  //     if (res.length === 0) {
  //       this.isLoading = false;
  //       this.toastr.error('You do not upload documents! Please upload them.');
  //     }
  //     // Sắp xếp mảng theo giá trị tăng dần của trunkCount
  //     res.sort((a, b) => a.trunkCount - b.trunkCount);

  //     // Kiểm tra số lượng phần tử trong mảng và lấy ra content tương ứng
  //     if (res.length >= 3) {
  //       this.documentResponse1 = res[0].content + res[1].content + res[2].content;
  //     } else if (res.length === 2) {
  //       this.documentResponse1 = res[0].content + res[1].content;
  //     } else if (res.length === 1) {
  //       this.documentResponse1 = res[0].content;
  //     }
  //     this.documentFileName = res[0].fileName;
  //     this.timeoutId = setTimeout(() => {
  //       this.clickChatWithDoc(this.documentResponse1,dataR);
  //     }, 1000);
  //   })
  // }

  clickChatWithDoc(documentResponse1,dataR){
    this.isLoading = true;
    const request1 = {
      model:this.chatRequest.model,
      messages: [
        {
          role: "system",
          content: "Be precise and concise."
        },
        {
          role: "user",
          content: "{Context} " + this.chatRequest.context + " " + documentResponse1 + " {End}.<br><b>Question: " + dataR +"</b>"
        },
      ],
      type: 0
    }

    const request2 = {
      model:this.chatRequest.model,
      messages: [
        {
          role: "system",
          content: "Be precise and concise."
        },
        {
          role: "user",
          content: "Hãy tạo cho tôi 3 câu hỏi bằng tiếng việt tương tự câu hỏi sau: " + dataR
        },
      ],
      type: 1
    }


    // this.chatBoxService.send(request1).subscribe((res:any) =>{
    //   if(res.status === "OK"){
    //     this.isLoading = false;
    //     this.getMessage0();
    //     this.chatRequest.content = '';
    //     sessionStorage.setItem('releated',res.data.choices[0].message.content);
    //     console.log(res.data.choices[0].message.content);
    //   }else{
    //     this.toastr.error("co loi xay ra");
    //   }
    // })

    this.chatBoxService.send(request1).subscribe((res:any) =>{
      if(res.status === "OK"){
        this.isLoading = false;
        this.getMessage0();
        this.chatRequest.content = '';

        // this.chatBoxService.genarateChatBox(request2).subscribe((res:any) =>{
        //   this.isLoading = false;
        //   if(res.status === "OK"){
        //     // this.getMessage1();
        //     this.chatRequest.content = '';
        //     // sessionStorage.setItem('releated',res.data.choices[0].message.content);
        //     console.log(res.data.choices[0].message.content);
        //   }else{
        //     this.toastr.error("co loi xay ra");
        //   }
        // })
      }else{
        this.toastr.error("co loi xay ra");
      }
    }, error => {
      this.isLoading = false;
      console.error(error);
    });


    // this.isLoading = false;
    // this.chatBoxService.genarateChatBox(request2).subscribe((res:any) =>{
    //   this.isLoading = false;
    //   if(res.status === "OK"){
    //     // this.getMessage1();
    //     this.chatRequest.content = '';
    //     sessionStorage.setItem('releated',res.data.choices[0].message.content);
    //     console.log(res.data.choices[0].message.content);
    //   }else{
    //     this.toastr.error("co loi xay ra");
    //   }
    // })
  }

  getMessage0() {
    this.chatBoxService.getMessage(0).subscribe(res => {
      this.listMessage = res;
      this.listMessage.forEach(item => {
        item.isFirst = true;
      })
      if (!this.isFirst) {
        const lastMessage = this.listMessage.length - 1;
        this.listMessage[lastMessage].isFirst = false;
        setTimeout(() => {
          this.initializeTypewriters();
        }, 100);
      }
      this.isFirst = false;
      console.log(this.listMessage);
    })
  }

  /**
   * Hàm render text writer
   */
  initializeTypewriters(): void {
    const lastItemIndex = this.listMessage.length - 1;
    const lastItem = this.listMessage[lastItemIndex];
    const lastTypewriter = new Typewriter(this.typewriterElements.last.nativeElement, {
      loop: false,
      typeSpeed: 30, // tốc độ chạy của text
    });
    lastTypewriter.type(lastItem.contentResponse).start();
  }

  getDocumentGroupList(){
    this.chatBoxService.getDocumentGroupList().subscribe(data => {
      this.listGroupDocument.push({name: "All Document"});
      this.groupDocument = this.listGroupDocument[0].name;
      // Duyệt qua mỗi phần tử trong dữ liệu trả về và thêm vào this.listGroupDocument
      data.forEach(item => {
        this.listGroupDocument.push({name: item.groupName});
      });
    }, error => {
      console.error('There was an error!', error);
    });
  }

  listMessage1;
  getMessage1(){
    this.chatBoxService.getMessage(1).subscribe(res =>{
      this.listMessage1 = res;
      console.log(this.releated);
      console.log(this.listMessage);
    })
  }

  openPdfViewer(documentFileName, documentContextHighline){
    const data = {
      filename: documentFileName,
      contextHighline: documentContextHighline
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

  isExpanded = false;

  toggleContent() {
    this.isExpanded = !this.isExpanded;
  }
}
