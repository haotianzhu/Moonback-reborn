import { Component, OnInit, Input, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map, filter } from 'rxjs/operators';
import { of, Observable, fromEvent } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/authentication/shared/auth.service';
import { LoadingService } from 'src/app/utils/loading.service';




@Component({
  selector: 'app-post-list-page',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  postArray = [];
  isLoading = true;
  url = null;
  limit = 10;
  pullable = false;
  scollPosInit: boolean;
  postsRoute$: Observable<any>;
  scroll$: Observable<any>;
  category: string;
  @Input() userId = null;
  @Input() isEdit = false;
  @ViewChildren('allposts') loadingQueryList: QueryList<any>;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingService,
    private cdref: ChangeDetectorRef) {
  }

  ngOnInit() {
    // api/post/user/id
    if (!this.auth.isAuth()) {
      this.router.navigate(['/signin']);
    }
    // https://angular.io/guide/router
    this.postsRoute$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => of(params.get('id')))
    );
    this.postsRoute$.subscribe(
      async (id) => {
        if (this.postArray.length === 0) {
          if (id || this.userId) { // with id
            if (this.userId) { id = this.userId; }
            this.url = `${environment.baseUrl + 'posts/user/' + id + '?limit=' + this.limit + '&sort=-modifyDate'}`;
            await this.loadingPost(this.url + '&skip=' + this.postArray.length);
            this.handlePosts(this.postArray);
          } else {
            // home page
            if (this.router.url.split('?')[0] === '/') {
              this.url = `${environment.baseUrl + 'posts?limit=' + this.limit + '&sort=-modifyDate'}`;
            } else {
              this.category = this.router.url.split('?')[0].split('/')[1];
              this.url = `${environment.baseUrl + 'posts?limit=' + this.limit + '&category=' + this.category + '&sort=-modifyDate'}`;
            }
            await this.loadingPost(this.url + '&skip=' + this.postArray.length);
            this.handlePosts(this.postArray);
          }
        }
      }
    );

    this.scroll$ = fromEvent(document, 'scroll')
      .pipe(
        filter(() => !this.isLoading),
        map(() => window.scrollY + window.innerHeight >= document.body.scrollHeight),
        filter(needFetch => needFetch && this.pullable)
      );
    this.scroll$.subscribe(
      () => {
        this.isLoading = true;
        this.loadingPost(this.url + '&skip=' + this.postArray.length);
      }
    );
  }

  handlePosts(posts: any[]) {
    posts.forEach((post, index) => {
      const parts = post.content.split('</p>', 5);
      if (parts.length > 4) {
        post.overview = post.content.split('</p>', 5).join('</p>') + '</p><br><br><h2>...</h2>';
      } else {
        post.overview = post.content.split('</p>', 5).join('</p>') + '</p><br><br>';
      }
      posts[index] = post;
    });
  }

  loadingPost(url) {
    this.loading.setLoadingTrue();
    this.cdref.detectChanges();
    return this.http.get<any>(url, { observe: 'response' })
      .toPromise()
      .then((res) => {
        if (res.body.length > 0) {
          this.postArray = this.postArray.concat(res.body.posts);
          this.loading.setLoadingFalse();
          this.cdref.detectChanges();
          if (res.body.length < this.limit) {
            this.pullable = false;
            this.isLoading = false;
          } else {
            this.pullable = true;
            this.isLoading = false;
          }
        }
      })
      .catch((error) => {
        this.pullable = false;
        this.isLoading = false;
      });
  }
}
