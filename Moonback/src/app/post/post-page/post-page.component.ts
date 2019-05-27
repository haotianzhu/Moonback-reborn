import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap, filter } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthService } from 'src/app/authentication/shared/auth.service';
import { environment } from 'src/environments/environment';
import { PostComponent } from '../post/post.component';
import { Content } from '@angular/compiler/src/render3/r3_ast';



@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
})
export class PostPageComponent implements OnInit {

  post: any;
  isViewable = true;
  isCreate = false;
  isConfirmed = false;
  @ViewChild('child') private childComponent: PostComponent;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    // https://angular.io/guide/router
    if (!this.post) {
      // fetch post
      this.route.paramMap.pipe(
        tap(() => {
          if (this.router.url.split('?')[0] === '/post/new') {
            this.isViewable = false;
            this.isCreate = true;
            this.post = {
              title: '',
              content: '',
              author: this.auth.getAuth().id
            };
          }
        }),
        switchMap((params: ParamMap) => of(params.get('id'))),
        filter((id) => id !== null && id !== undefined)
      ).subscribe(async (id) => {
        await this.loadingPost(id);
        this.checkEditPermission();
      });
    }
  }


  checkEditPermission() {
    this.isViewable = !(this.post.author === this.auth.getAuth().id);
  }

  loadingPost(id) {
    return this.http.get<any>(
      `${environment.baseUrl + 'posts/' + id}`
    ).toPromise(
    ).then(async (res) => {
      if (res) {
        this.post = res.post;
        return false;
      }
    }).catch((error) => {
      return true;
    });
  }

  onSave() {
    if (this.childComponent.validate()) {
      if (this.post && !this.post.id) {
        this.http.post<any>(
          `${environment.baseUrl + 'posts/'}`,
          { post: this.post },
          { observe: 'response' }
        ).subscribe(
          res => {
            if (res.status === 200) {
              this.router.navigate(['/']);
            }
          },
          error => {
          });
      } else if (this.post && this.post.id) {
        this.http.patch<any>(
          `${environment.baseUrl + 'posts/' + this.post.id}`,
          { post: this.post },
          { observe: 'response' }
        ).subscribe(
          res => {
            if (res.status === 200) {
              this.router.navigate(['/']);
            }
          },
          error => {
          });
      }
    }
  }

  onDelete() {
    if (this.post) {
      this.http.delete<any>(
        `${environment.baseUrl + 'posts/' + this.post.id}`,
        { observe: 'response' }
      ).subscribe(
        res => {
          if (res.status === 200) {
            this.router.navigate(['/']);
          }
        },
        error => {
        });
    }
  }
}
