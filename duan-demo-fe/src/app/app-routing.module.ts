import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { PublicComponent } from './component/public/public.component';
import { LoginComponent } from './component/login/login.component';
import { AuthenticatedComponent } from './component/authenticated/authenticated.component';
import { AuthGuard } from './_helper/auth.guard';
import { ListNoteComponent } from './component/list-note/list-note.component';
import { ListTaskComponent } from './component/list-task/list-task.component';
import { CommonModule } from '@angular/common';
import { RegisterAccountComponent } from './component/register-account/register-account.component';
import { ManagementUserComponent } from './component/management-user/management-user.component';
import { ChatBoxComponent } from './component/chat-box/chat-box.component';
import { ManagementRoleComponent } from './component/management-role/management-role.component';


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
      { path: 'list-task', component: ListTaskComponent, canActivate: [AuthGuard] },
      { path: 'list-management-user', component: ManagementUserComponent, canActivate: [AuthGuard] },

      { path: 'list-management-role', component: ManagementRoleComponent, canActivate: [AuthGuard] },
      
      { path: 'chat-box', component: ChatBoxComponent , canActivate: [AuthGuard]},
   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
