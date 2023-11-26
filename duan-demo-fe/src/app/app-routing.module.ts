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


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '', component: PublicComponent, children: [
    {
      path: 'login',
      component: LoginComponent
    }
  ] },
  {
    path: '', component: AuthenticatedComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'list-note', component: ListNoteComponent, canActivate: [AuthGuard] },
      { path: 'list-task', component: ListTaskComponent, canActivate: [AuthGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
