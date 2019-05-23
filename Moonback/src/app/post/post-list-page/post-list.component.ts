
import {
  Component,
  OnInit, Renderer2,
  ElementRef,
  Inject, forwardRef,
  ViewChildren, QueryList
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { delay, async } from 'q';
import { concatMap, switchMap, map, mapTo, combineLatest, mergeMap, debounceTime, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/authentication/shared/auth.service';
import { of, Observable, fromEvent, concat } from 'rxjs';
import { AppComponent } from 'src/app/app.component';


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

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private rd: Renderer2,
    private element: ElementRef) {
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
          if (id) { // with id
            this.url = `${environment.baseUrl + 'posts/user/' + id + '?limit=' + this.limit + '&sort=-modifyDate'}`;
            this.loadingPost(this.url + '&skip=' + this.postArray.length);
          } else {
            // home page
            this.url = `${environment.baseUrl + 'posts?limit=' + this.limit + '&sort=-modifyDate'}`;
            await this.loadingPost(this.url + '&skip=' + this.postArray.length);
            this.handlePosts(this.postArray)
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
    return this.http.get<any>(url, { observe: 'response' })
      .toPromise()
      .then((res) => {
        if (res.body.length > 0) {
          this.postArray = this.postArray.concat(res.body.posts);
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
