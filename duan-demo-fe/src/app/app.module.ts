import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { PublicComponent } from './component/public/public.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthenticatedComponent } from './component/authenticated/authenticated.component';
import { CommonModule } from '@angular/common';
import { ListNoteComponent } from './component/list-note/list-note.component';
import { ListTaskComponent } from './component/list-task/list-task.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';

@NgModule({
  declarations: [	
    AppComponent,
    LoginComponent,
    PublicComponent,
    
    AuthenticatedComponent,
    DashboardComponent,
    ListNoteComponent,
    ListTaskComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
