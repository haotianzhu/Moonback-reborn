import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigninComponent } from './authentication/signin/signin.component';
import { SignoutComponent } from './authentication/signout/signout.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { PostComponent } from './post/post/post.component';
import { UserprofileComponent } from './user/userprofile/userprofile.component';
import { NotFound404Component } from './not-found404/not-found404.component';

const routes: Routes = [
  { path: '', component: PostListComponent},
  { path: 'signin', component: SigninComponent},
  { path: 'signout', component: SignoutComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'user/:id', component: PostListComponent},
  { path: 'posts/:id', component: PostComponent},
  { path: 'account/settings', component: UserprofileComponent},
  { path: '**', component: NotFound404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
