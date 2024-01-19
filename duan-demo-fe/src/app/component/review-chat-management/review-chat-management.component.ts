import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Review } from 'src/app/_model/review-chat';
import { ReviewServiceService } from 'src/app/_service/review-service/review-service.service';
import { TokenStorageService } from 'src/app/_service/token-storage-service/token-storage.service';

@Component({
  selector: 'app-review-chat-management',
  templateUrl: './review-chat-management.component.html',
  styleUrls: ['./review-chat-management.component.scss']
})
export class ReviewChatManagementComponent implements OnInit {

  public user: any = {};
  role;
  username;

  listChatReview : Review[];
  constructor(
    private reviewService: ReviewServiceService,
    private tokenService: TokenStorageService,
    private changeDetectorRef: ChangeDetectorRef,) {

    }

  ngOnInit(): void {
    this.getListReviewChat();
  }

  getListReviewChat(){

    // lay username tu localStorage
    this.role = this.tokenService.getRole();
    this.username = this.tokenService.getUser();

    this.user = {
      username: this.username,
      role: this.role
    }

    this.reviewService.getListReviewUser(this.username, this.role).subscribe(
      (res:any) => {
        this.listChatReview = res.data;
        console.log(this.listChatReview + ">>>>>>>>>>");

        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        console.error("Error getting list of notes:", error);
      }
    );
  }
}
