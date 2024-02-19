import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_helper/auth.guard';
import { AuthenticatedComponent } from './component/authenticated/authenticated.component';
import { ChatBoxComponent } from './component/chat-box/chat-box.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ListNoteComponent } from './component/list-note/list-note.component';
import { ListTaskComponent } from './component/list-task/list-task.component';
import { LoginComponent } from './component/login/login.component';
import { ManagementPromptComponent } from './component/management-prompt/management-prompt.component';
import { ManagementRoleComponent } from './component/management-role/management-role.component';
import { ManagementUserComponent } from './component/management-user/management-user.component';
import { PublicComponent } from './component/public/public.component';
import { QuestionAnswerComponent } from './component/question-answer/question-answer.component';
import { RegisterAccountComponent } from './component/register-account/register-account.component';
import { ReviewChatManagementComponent } from './component/review-chat-management/review-chat-management.component';
import { ViewReferDocumentComponent } from './component/view-refer-document/view-refer-document.component';
import { DocumentManagementPortalComponent } from './component/document-management-portal/document-management-portal.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '', component: PublicComponent, children: [
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'register-account',
      component: RegisterAccountComponent
    }
  ] },
  {
    path: '', component: AuthenticatedComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'list-note', component: ListNoteComponent, canActivate: [AuthGuard] },
      { path: 'review-chat-management', component: ReviewChatManagementComponent, canActivate: [AuthGuard] },
      { path: 'view-refer-document', component: ViewReferDocumentComponent },
      { path: 'list-task', component: ListTaskComponent, canActivate: [AuthGuard] },
      { path: 'list-management-user', component: ManagementUserComponent, canActivate: [AuthGuard] },

      { path: 'list-management-role', component: ManagementRoleComponent, canActivate: [AuthGuard] },

      { path: 'list-management-prompt', component: ManagementPromptComponent, canActivate: [AuthGuard] },

      { path: 'chat-box', component: ChatBoxComponent , canActivate: [AuthGuard]},
      { path: 'question-answer', component:  QuestionAnswerComponent, canActivate: [AuthGuard] },
      { path: 'document-portal', component:  DocumentManagementPortalComponent, canActivate: [AuthGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
