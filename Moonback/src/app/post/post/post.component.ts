import {
  EventEmitter, Component,
  OnInit, Input,
  HostListener, Renderer2,
  ElementRef, AfterViewInit,
  Output
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../authentication/shared/auth.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { interval, merge, concat, of } from 'rxjs';
import { mergeMapTo, takeUntil, mergeMap, map, mapTo, take, tap, switchMap, takeWhile } from 'rxjs/operators';
import { async } from 'q';
import { post } from 'selenium-webdriver/http';
import { Location } from '@angular/common';



// @Component({
//   selector: 'app-post-modal-content',
//   templateUrl: './post.content.html'
// })

// export class PostModalContent {  // tslint:disable-line:component-class-suffix
//   @Input() post;
//   @Input() isEditable;
//   isEditMode = false;
//   isPending = false;
//   sideBarvalue = '0';

//   constructor(
//     public activeModal: NgbActiveModal,
//     private http: HttpClient,
//     private rd: Renderer2,
//     private element: ElementRef) {
//   }

//   async onSave() {
//     this.isPending = true;

//     const update$ = this.http.patch<any>(
//       `${environment.baseUrl + 'posts/' + this.post.id}`, { post: this.post },
//       { observe: 'response' }
//     ).pipe(
//       map(res => res.status === 200)
//     );
//     const timer$ = interval(1000).pipe(take(5), map(x => 10 + x * 18));
//     const result$ = merge(timer$, update$);
//     await result$.subscribe(async (success) => {
//       if (success === true) {
//         return this.activeModal.close({ done: false, post: this.post });
//       } else if (success === false) {
//         return this.activeModal.close({ done: true });
//       } else {
//         this.sideBarvalue = success.toString();
//       }
//     });
//     this.isPending = false;
//   }

//   onEdit() {
//     this.isEditMode = this.isEditable;
//   }

//   onClose() {
//     this.activeModal.close({ done: true });
//   }
// }


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  post: any;
  tmpPost: any;
  @Input() isView = true;
  @Input() isSingle = true;
  isEditable = false;
  isPending = false;
  sideBarvalue = '0';

  @Input('post')
  set setPost(val: object) {
    this.post = val;
  }

  constructor(
    private router: Router,
    private auth: AuthService,
    private http: HttpClient,
    private rd: Renderer2,
    private route: ActivatedRoute,
    private element: ElementRef,
    private location: Location) { }

  ngOnInit() {
    if (!this.auth.isAuth()) {
      this.router.navigate(['/signin']);
    }
    if (!this.post) {
      // fetch post
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) => of(params.get('id')))
      ).subscribe(async (id) => {
        await this.loadingPost(id);
        this.isEditable = await this.checkIsEditable();
      });
    }
  }
  onBack() {
    this.location.back();
  }
  onEdit() {
    if (this.checkIsEditable()) {
      this.isView = false;
      this.tmpPost = Object.assign({}, this.post);
    }
  }
  onCancel() {
    this.isView = true;
  }
  checkIsEditable() {
    return (this.post.author === this.auth.getAuth().id);
  }

  async onSave() {
    this.isPending = true;
    const update$ = this.http.patch<any>(
      `${environment.baseUrl + 'posts/' + this.post.id}`, { post: this.tmpPost },
      { observe: 'response' }
    ).pipe(
      map(res => res.status === 200)
    );
    const timer$ = interval(1000).pipe(take(5), map(x => 10 + x * 18));
    const result$ = merge(timer$, update$);
    result$.subscribe(async (success) => {
      if (success === true) {
        this.post = await Object.assign(this.tmpPost, this.post);
        this.isPending = false;
        await this.onCancel();
      } else if (success === false) {
        this.isPending = false;
      } else {
        this.sideBarvalue = success.toString();
      }
    });
  }

  async loadingPost(id) {
    this.isPending = await this.http.get<any>(`${environment.baseUrl + 'posts/' + id}`)
      .toPromise()
      .then(async (res) => {
        if (res && res.post) {
          this.post = res.post;
          return false;
        }
      })
      .catch((error) => {
        return true;
      });
  }
}
