import { Component, OnInit, Input, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/authentication/shared/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, tap, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
})
export class PostPageComponent implements OnInit {

  post: any;
  isViewable = true;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // https://angular.io/guide/router
    if (!this.post) {
      // fetch post
      this.route.paramMap.pipe(
        tap(() => {
          if (this.router.url.split('?')[0] === '/post/new') {
            this.isViewable = false;
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

  onCreate() {
    if (this.post) {
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
    }
  }
}
