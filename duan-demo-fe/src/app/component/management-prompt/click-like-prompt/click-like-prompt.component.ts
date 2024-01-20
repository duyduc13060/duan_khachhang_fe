import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ClickLikeService } from 'src/app/_service/click-service/click-like.service';
import { ManagementPromptComponent } from '../management-prompt.component';

@Component({
  selector: 'app-click-like-prompt',
  templateUrl: './click-like-prompt.component.html',
  styleUrls: ['./click-like-prompt.component.scss']
})
export class ClickLikePromptComponent implements OnInit,ICellRendererAngularComp {
  params;
  checkButtonLike = false;

  constructor(
    private clickLikeService: ClickLikeService,
    private changeDetechtorRef: ChangeDetectorRef,
    private managementPromptComponent: ManagementPromptComponent,
  ) { }

  ngOnInit() {
    this.viewDetailClick();
    this.countNumberLike();
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
  agInit(params: ICellRendererParams): void {
    this.params = params;
    console.log(this.params);
  }

  clickLike(){
    const data = {
      promptId: this.params.data.id
    }
    this.clickLikeService.clickLike(data).subscribe(res=>{
      console.log("da like");
      // this.managementPromptComponent.searchPrompt(1);
      this.countNumberLike();
      this.viewDetailClick();
    })
   
  }

  viewDetailClick(){
    const data = {
      promptId: this.params.data.id
    }
    this.clickLikeService.viewDetail(data).subscribe(res=>{
      if(res?.data != null){
        this.checkButtonLike = true;
        console.log(res?.data);
        console.log(this.checkButtonLike);
      }else{
        this.checkButtonLike = false;
      }
    })
  }

  numberLike;
  countNumberLike(){
    const data = {
      promptId: this.params.data.id
    }
    this.clickLikeService.countNumberLike(data).subscribe(res =>{
      this.numberLike = res.data.numberLike;
    })
  }




}
