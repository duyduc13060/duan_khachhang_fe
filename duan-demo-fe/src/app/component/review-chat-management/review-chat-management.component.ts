import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
  currentPage = 1;
  itemsPerPage = 10;
  totalPages;
  count : number = 0;

  constructor(
    private reviewService: ReviewServiceService,
    private tokenService: TokenStorageService,
    private changeDetectorRef: ChangeDetectorRef,
    private toaStr : ToastrService,) {

    }

  ngOnInit(): void {
    this.getListReviewChat(this.currentPage);
  }

  paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  getListReviewChat(currentPage){

    // lay username tu localStorage
    this.role = this.tokenService.getRole();
    this.username = this.tokenService.getUser();

    this.user = {
      username: this.username,
      role: this.role
    }

    this.reviewService.getListReviewUser(this.username, this.role).subscribe(
      (res:any) => {
        // this.listChatReview = res.data;
        this.listChatReview = this.paginate(res.data, this.itemsPerPage, this.currentPage);

        // Giả sử res.data.length là một số nguyên hoặc null
        let dataLength = res.data ? res.data.length : 0;

        // Khởi tạo mảng totalPages với giá trị mặc định là [1]
        this.totalPages = [1];

        // Tính toán số trang dựa trên dataLength
        if (dataLength > 10) {
          // Tính số trang cần thiết
          let numberOfPages = Math.ceil(dataLength / 10);
          // Tạo mảng các số nguyên từ 1 đến numberOfPages
          this.totalPages = Array.from({ length: numberOfPages }, (_, i) => i + 1);
        }
        console.log(this.listChatReview + ">>>>>>>>>>");

        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        console.error("Error getting list of notes:", error);
      }
    );
  }

  changePage(page: number) {
    this.currentPage = page;
    this.count = (page - 1) * 10;
    this.getListReviewChat(this.currentPage);
  }

  deleteReview(reviewId: any) {
    if (confirm("Bạn có chắc chắn muốn xóa Feedback đã chọn không?")) {
      this.reviewService.deleteReview(reviewId).subscribe(() => {
        this.toaStr.success("Xóa không thành công !!!");
      }, (response) => {
        if (response.status === 200) {
          this.toaStr.success("Xóa thành công !!!");
        } else {
          this.toaStr.success("Xóa không thành công !!!");
        }
      }).add(() => {
        this.getListReviewChat(this.currentPage);
      });
    }
  }
}
