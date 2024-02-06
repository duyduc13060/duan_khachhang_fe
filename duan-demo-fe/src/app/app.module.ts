import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthInterceptor } from './_helper/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticatedComponent } from './component/authenticated/authenticated.component';
import { ChatBoxComponent } from './component/chat-box/chat-box.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ListNoteComponent } from './component/list-note/list-note.component';
import { ListTaskComponent } from './component/list-task/list-task.component';
import { LoginComponent } from './component/login/login.component';
import { ActionPromptManageComponent } from './component/management-prompt/action-prompt-manage/action-prompt-manage.component';
import { ClickLikePromptComponent } from './component/management-prompt/click-like-prompt/click-like-prompt.component';
import { CreateUpdatePromptComponent } from './component/management-prompt/create-update-prompt/create-update-prompt.component';
import { ManagementPromptComponent } from './component/management-prompt/management-prompt.component';
import { ViewDetailPromptComponent } from './component/management-prompt/view-detail-prompt/view-detail-prompt.component';
import { ActionRolesManagerComponent } from './component/management-role/action-roles-manager/action-roles-manager.component';
import { CreateUpdateRolesComponent } from './component/management-role/create-update-roles/create-update-roles.component';
import { ManagementRoleComponent } from './component/management-role/management-role.component';
import { ActionManagementUserComponent } from './component/management-user/action-management-user/action-management-user.component';
import { CreateUpdateUserComponent } from './component/management-user/create-update-user/create-update-user.component';
import { ManagementUserComponent } from './component/management-user/management-user.component';
import { NgbSingleDatePickerComponent } from './component/ngb-single-date-picker/ngb-single-date-picker.component';
import { PaginationComponent } from './component/pagination/pagination.component';
import { PublicComponent } from './component/public/public.component';
import { QuestionAnswerComponent } from './component/question-answer/question-answer.component';
import { RegisterAccountComponent } from './component/register-account/register-account.component';
import { ReviewChatManagementComponent } from './component/review-chat-management/review-chat-management.component';
import { ReviewComponent } from './component/review/review.component';
import { Date2Component } from './component/share/date2/date2.component';
import { SpinnerComponent } from './component/spinner/spinner.component';
import { ViewReferDocumentComponent } from './component/view-refer-document/view-refer-document.component';
import { CalendarTriggerDirective } from './directives/calendar-trigger.directive';
import { HighlighterPipe } from './pipes/highlighter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PublicComponent,

    ManagementUserComponent,
    CreateUpdateUserComponent,
    ActionManagementUserComponent,

    ManagementRoleComponent,
    CreateUpdateRolesComponent,
    ActionRolesManagerComponent,

    ManagementPromptComponent,
    CreateUpdatePromptComponent,
    ActionPromptManageComponent,
    ViewDetailPromptComponent,
    ClickLikePromptComponent,

    ChatBoxComponent,

    QuestionAnswerComponent,
    ReviewComponent,



    AuthenticatedComponent,
    DashboardComponent,
    ListNoteComponent,
    ListTaskComponent,
    RegisterAccountComponent,
    SpinnerComponent,
    PaginationComponent,

    NgbSingleDatePickerComponent,
    Date2Component,
    CalendarTriggerDirective,
    ReviewChatManagementComponent,
    ViewReferDocumentComponent,
    HighlighterPipe
   ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgSelectModule,

    MatDialogModule,
    MatTooltipModule,
    MatCheckboxModule,


    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
    }),
    AgGridModule.withComponents([
      ManagementRoleComponent
    ]),
    NgbModule,
    NgbDatepickerModule,

  ],
  providers: [
    ToastrService,
    BsModalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
