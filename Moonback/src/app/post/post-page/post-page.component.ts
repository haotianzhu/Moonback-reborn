import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/authentication/shared/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  post: any;
  isViewable = false;

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
        switchMap((params: ParamMap) => of(params.get('id')))
      ).subscribe(async (id) => {
        await this.loadingPost(id);
      });
    }
  }

  checkEditPermission() {
    this.isViewable = this.post.author === this.auth.getAuth().id;
  }

  loadingPost(id) {
    this.http.get<any>(
      `${environment.baseUrl + 'posts/' + id}`
    ).toPromise(
    ).then(async (res) => {
      if (res && res.post) {
        this.post = res.post;
        return false;
      }
    }).catch((error) => {
      return true;
    });
  }
}
