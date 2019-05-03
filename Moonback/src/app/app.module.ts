import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PostComponent } from './post/post.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './authentication/signin/signin.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AuthTokenInterceptor } from './authentication/token.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SignoutComponent } from './authentication/signout/signout.component';

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
    SignoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot()
  ],
  providers: [
    [{ provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true }]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
