import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './authentication/signin/signin.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AuthTokenInterceptor } from './authentication/token.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignoutComponent } from './authentication/signout/signout.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { PostComponent, PostModalContent } from './post/post/post.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
    SignoutComponent,
    PostListComponent,
    PostComponent,
    PostModalContent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  providers: [
    [{ provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true }]
  ],
  entryComponents: [PostModalContent],
  bootstrap: [AppComponent]
})
export class AppModule { }
