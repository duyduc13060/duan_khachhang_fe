import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskServiceService } from 'src/app/_service/task-service/task-service.service';
import { TokenStorageService } from 'src/app/_service/token-storage-service/token-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.scss']
})
export class ListTaskComponent implements OnInit {

  public user: any = {};
  username;

  listTaskByUsername;


  constructor(
    private taskService: TaskServiceService,
    private tokenService: TokenStorageService,
    private changeDetectorRef: ChangeDetectorRef,
    private toastr: ToastrService
  ) { 
    
  }

  ngOnInit() {
    this.getListNoteByUsername();
  }


  getListNoteByUsername(){

    // lay username tu localStorage
    this.username = this.tokenService.getUser();

    this.user = {
      username: this.username
    }
    
    this.taskService.getListTaskByUserName(this.user).subscribe(
      (res:any) => {
        this.listTaskByUsername = res;
        console.log(this.listTaskByUsername + ">>>>>>>>>>");
        this.toastr.success('Đăng nhập thành công');
        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        console.error("Error getting list of notes:", error);
      }
    );
  }

  mapPriorityToString(priority: number): string {
    switch (priority) {
      case 2:
        return 'High';
      case 1:
        return 'Medium';
      case 0:
        return 'Low';
      default:
        return 'Unknown'; // Hoặc giá trị mặc định khác nếu có
    }
  }

  mapStatusToString(status: number): string {
    switch (status) {
      case 2:
        return 'Đang thực hiện';
      case 1:
        return 'Đã hoàn thành';
      case 0:
        return 'Đã hủy';
      default:
        return 'Unknown'; // Hoặc giá trị mặc định khác nếu có
    }
  }

}
