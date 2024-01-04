import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Optional } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Review } from 'src/app/_model/review-chat';
import { ReviewServiceService } from 'src/app/_service/review-service/review-service.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  review = new Review;

  body;
  constructor(
    public dialogRef: MatDialogRef<ReviewComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private reviewService: ReviewServiceService,
    private toaStr : ToastrService
  ) { 
    this.body = data;
  }

  ngOnInit() {
   
  }

  createReview(){
    console.log(this.review.content + ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    const data = {
      content: this.review.content,
      messageId: this.body.messageId
    }

    this.reviewService.createReview(data).subscribe(res=>{
      if(res.message === 'success'){
        this.toaStr.success(res.message);
        this.dialogRef.close({
          event: 'add success'
        })
      }else{
        this.toaStr.error(res.message);
      }
    })
  }

  closeModal(){
    this.dialogRef.close({event: 'cancel'});
  }

}
