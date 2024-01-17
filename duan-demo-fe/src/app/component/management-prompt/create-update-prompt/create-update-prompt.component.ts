import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Optional } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ValidateInput } from 'src/app/_model/validate-input.model';
import { PromptService } from 'src/app/_service/prompt-service/prompt.service';
import { PromptTypeService } from 'src/app/_service/prompt-type/prompt-type.service';
import { CommonFunction } from 'src/app/utils/common-function';

@Component({
  selector: 'app-create-update-prompt',
  templateUrl: './create-update-prompt.component.html',
  styleUrls: ['./create-update-prompt.component.scss']
})
export class CreateUpdatePromptComponent implements OnInit {

  listPromptType;
  body = {
    id: null,
    promptTypeId: null,
    promptName: null,
    descriptionUse: null,
  }
  isUpdate = false;

  validPromptName:ValidateInput = new ValidateInput();
  validPtUseName:ValidateInput = new ValidateInput();
  validpromptTypeId:ValidateInput = new ValidateInput();

  constructor(
    private changeDetechtorRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<CreateUpdatePromptComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toaStr : ToastrService,
    private promptServiceType: PromptTypeService,
    private promptService: PromptService,
  ) { 

    this.isUpdate = false
    if(data !== null){
      this.isUpdate = true;
      this.body = data;
    }
  }

  ngOnInit() {
    this.getAllPromptType();
  }


  getAllPromptType(){
    this.promptServiceType.getAll().subscribe(res =>{
      this.listPromptType = res.data;
    })
  }

  validPtName(){
    this.validPromptName = CommonFunction.validateInput(this.body.promptName, 1000, null)
  }

  validPrtUseName(){
    this.validPtUseName = CommonFunction.validateInput(this.body.descriptionUse, 1000, null)
  }

  revoveInvalid(result){
    result.done = true
  }

  submit(){
    this.validpromptTypeId = CommonFunction.validateInput(this.body.promptTypeId, null, null)
    this.validPtUseName = CommonFunction.validateInput(this.body.descriptionUse, 1000, null)
    this.validPromptName = CommonFunction.validateInput(this.body.promptName, 1000, null)

    if(!this.validPromptName.done || !this.validPtUseName.done || !this.validpromptTypeId.done){
      return
    }

    const bodySave ={
      id: this.body.id,
      promptTypeId: this.body.promptTypeId,
      promptName: this.body.promptName,
      descriptionUse: this.body.descriptionUse
    }

    if(this.body.id == null || this.body.id == undefined){
      this.promptService.createPrompt(bodySave).subscribe(res =>{
        if(res.status === 'OK'){
          this.toaStr.success(res.message);
          this.dialogRef.close({
            event: 'add success'
          })
        }else{
          this.toaStr.error(res.message);
        }
      })
    }else{
      this.promptService.updatePrompt(bodySave).subscribe(res=>{
        if(res.status === 'OK'){
          this.toaStr.success(res.message);
          this.dialogRef.close({
            event: 'add success'
          })
        }else{
          this.toaStr.error(res.message);
        }
      })
    }


  }

  closeModal(){
    this.dialogRef.close({event: 'cancel'});
  }

}
