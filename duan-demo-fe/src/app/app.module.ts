import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { PublicComponent } from './component/public/public.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticatedComponent } from './component/authenticated/authenticated.component';
import { CommonModule } from '@angular/common';
import { ListNoteComponent } from './component/list-note/list-note.component';
import { ListTaskComponent } from './component/list-task/list-task.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RegisterAccountComponent } from './component/register-account/register-account.component';
import {ToastrComponentlessModule, ToastrModule, ToastrService} from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerComponent } from './component/spinner/spinner.component';
import { ManagementUserComponent } from './component/management-user/management-user.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AuthInterceptor } from './_helper/auth.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateUpdateUserComponent } from './component/management-user/create-update-user/create-update-user.component';
import { ActionManagementUserComponent } from './component/management-user/action-management-user/action-management-user.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PublicComponent,

    ManagementUserComponent,
    CreateUpdateUserComponent,
    ActionManagementUserComponent,

    AuthenticatedComponent,
    DashboardComponent,
    ListNoteComponent,
    ListTaskComponent,
    RegisterAccountComponent,
    SpinnerComponent
   ],
  imports: [
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
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
    }),

  ],
  providers: [
    ToastrService,
    BsModalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
