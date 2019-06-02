import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigninComponent } from './authentication/signin/signin.component';
import { SignoutComponent } from './authentication/signout/signout.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { PostListComponent } from './post/post-list-page/post-list.component';
import { UserprofileComponent } from './user/userprofile/userprofile.component';
import { NotFound404Component } from './not-found404/not-found404.component';
import { PostPageComponent } from './post/post-page/post-page.component';
import { ResetComponent } from './authentication/reset/reset.component';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signout', component: SignoutComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'account/reset', component: ResetComponent },
  { path: 'game', component: PostListComponent },
  { path: 'anime', component: PostListComponent },
  { path: 'novel', component: PostListComponent },
  { path: 'manga', component: PostListComponent },
  { path: 'user/:id', component: PostListComponent },
  { path: 'posts/:id', component: PostPageComponent },
  { path: 'account/settings', component: UserprofileComponent },
  { path: 'post/new', component: PostPageComponent },
  { path: '404', component: NotFound404Component },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
