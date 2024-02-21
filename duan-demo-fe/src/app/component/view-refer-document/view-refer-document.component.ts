import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { QuestionAnswerServiceService } from 'src/app/_service/question-answer-service/question-answer-service.service';

@Component({
  selector: 'app-view-refer-document',
  templateUrl: './view-refer-document.component.html',
  styleUrls: ['./view-refer-document.component.scss']
})
export class ViewReferDocumentComponent implements OnInit {

  documentFileName: string;
  allFileContent: string;
  contentHighline = '';
  body;
  constructor(
    private route: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private questionAnswerServiceService : QuestionAnswerServiceService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.clickRefer(this.data);
    this.contentHighline = this.data.contentHighline;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const element = document.querySelector('.highlighted-text');
      element.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 100);
  }

  clickRefer(data : any){
    this.questionAnswerServiceService.getOriginalFile(data).subscribe(
      res => {
        // Xử lý dữ liệu trả về ở đây
        this.allFileContent = res.fileContent;
      },
      err => {
        // Xử lý lỗi ở đây
        this.toastr.error('lỗi');
      }
    );
}

}
