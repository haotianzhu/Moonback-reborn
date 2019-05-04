import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './authentication/signin/signin.component';
import { SignoutComponent } from './authentication/signout/signout.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { PostListComponent } from './post/post-list/post-list.component';

const routes: Routes = [
  { path: '', component: PostListComponent},
  { path: 'signin', component: SigninComponent},
  { path: 'signout', component: SignoutComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'user/:id', component: PostListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
