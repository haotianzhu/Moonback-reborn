import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { concatMap, switchMap, map, mapTo, combineLatest, mergeMap, debounceTime, filter } from 'rxjs/operators';
import { AuthService } from 'src/app/authentication/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { delay, async } from 'q';
import { of, Observable, fromEvent, concat } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  postArray = [];
  isLoading = true;
  url = null;
  pullable = true;
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

    //https://angular.io/guide/router
    this.postsRoute$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => of(params.get('id')))
    )
    this.postsRoute$.subscribe(
      (id) => {
        if (id) { // with id
          this.url = `${environment.baseUrl + 'posts/user/' + id + '?limit=100'}`
          this.loadingPost(this.url + '&skip=' + this.postArray.length);
        } else {
          // home page
          this.url = `${environment.baseUrl + 'posts?limit=100'}`;
          this.loadingPost(this.url + '&skip=' + this.postArray.length);
        }
      }
    )

    this.scroll$ = fromEvent(document, 'scroll')
      .pipe(
        map(() => {
          return (window.scrollY + window.innerHeight == document.body.scrollHeight);
        }),
        filter(needFetch => needFetch && this.pullable)
      )
    this.scroll$.subscribe(
      () => {
        this.isLoading = true;
        this.loadingPost(this.url + '&skip=' + this.postArray.length);
        return;
      }
    )
  }

  async loadingPost(url) {
    this.isLoading = await this.http.get<any>(url, { observe: 'response' })
      .toPromise()
      .then(async (res) => {
        await delay(500)
        if (res.body.length == 0) {
          this.pullable = false;
          return;
        }
        if (res.body.length > 0) {
          // this.postArray = this.postArray.concat(res.body.posts);
          this.postArray = res.body.posts;
          return false
        }
      })
      .catch((error) => {
        return true
      });
  }
}
