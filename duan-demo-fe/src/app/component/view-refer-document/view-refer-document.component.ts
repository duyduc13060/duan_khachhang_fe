import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-refer-document',
  templateUrl: './view-refer-document.component.html',
  styleUrls: ['./view-refer-document.component.scss']
})
export class ViewReferDocumentComponent implements OnInit {

  documentFileName = '';
  // allFileContent: string;
  contextHighline = '';
  constructor(
    private route: ActivatedRoute,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    // private questionAnswerServiceService : QuestionAnswerServiceService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    // this.clickRefer(this.data);
    this.documentFileName = this.data.filename;
    this.contextHighline = this.data.contextHighline;
  }

//   ngAfterViewInit() {
//     setTimeout(() => {
//       const element = document.querySelector('.highlighted-text');
//       element.scrollIntoView({ block: 'center', behavior: 'smooth' });
//     }, 100);
//   }

//   clickRefer(data : any){
//     this.questionAnswerServiceService.getOriginalFile(data).subscribe(
//       res => {
//         // Xử lý dữ liệu trả về ở đây
//         this.allFileContent = res.fileContent;
//       },
//       err => {
//         // Xử lý lỗi ở đây
//         this.toastr.error('lỗi');
//       }
//     );
// }

}
