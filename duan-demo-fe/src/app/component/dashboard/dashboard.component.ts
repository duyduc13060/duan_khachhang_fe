import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  content: string;
  ngOnInit() {
    this.content = '<p style="display: none">' + " Cập nhật thêm tính năng xem các feedback của</p>";
    // this.content = '<p style="display: none;">' + "{Context}   cầu của người giám hộ, kết nơ {End}</p>.<br><b>Question: giới thiệu về các loại phí liên quan đến tài khoản"
  }

}
