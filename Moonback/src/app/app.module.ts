import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { QuillModule } from 'ngx-quill';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './authentication/signin/signin.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { SignoutComponent } from './authentication/signout/signout.component';
import { AuthTokenInterceptor } from './authentication/shared/token.service';
import { PostListComponent } from './post/post-list/post-list.component';
import { PostComponent } from './post/post/post.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { MoonMaterialModule } from '../material-module';
import { SidebarComponent } from './home/sidebar/sidebar.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
    SignoutComponent,
    PostListComponent,
    PostComponent,
    UserprofileComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    QuillModule,
    NgbModule,
    MoonMaterialModule
  ],
  providers: [
    [{ provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true }]
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
