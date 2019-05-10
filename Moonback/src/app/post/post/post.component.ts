import {
  EventEmitter, Component,
  OnInit, Input,
  HostListener, Renderer2,
  ElementRef, AfterViewInit,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../authentication/shared/auth.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { interval, merge, concat } from 'rxjs';
import { mergeMapTo, takeUntil, mergeMap, map, mapTo, take, tap } from 'rxjs/operators';
import { async } from 'q';



@Component({
  selector: 'app-post-modal-content',
  templateUrl: './post.content.html'
})

export class PostModalContent {  // tslint:disable-line:component-class-suffix
  @Input() post;
  @Input() isEditable;
  isEditMode = false;
  isPending = false;
  sideBarvalue = '0';

  constructor(
    public activeModal: NgbActiveModal,
    private http: HttpClient,
    private rd: Renderer2,
    private element: ElementRef) {
  }

  async onSave() {
    this.isPending = true;

    const update$ = this.http.patch<any>(
      `${environment.baseUrl + 'posts/' + this.post.id}`, { post: this.post },
      { observe: 'response' }
    ).pipe(
      map(res => res.status === 200)
    );
    const timer$ = interval(1000).pipe(take(5), map(x => 10 + x * 18));
    const result$ = merge(timer$, update$);
    await result$.subscribe(async (success) => {
      if (success === true) {
        return this.activeModal.close({ done: false, post: this.post });
      } else if (success === false) {
        return this.activeModal.close({ done: true });
      } else {
        this.sideBarvalue = success.toString();
      }
    });
    this.isPending = false;
  }

  onEdit() {
    this.isEditMode = this.isEditable;
  }

  onClose() {
    this.activeModal.close({ done: true });
  }
}


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  post: any;

  @Input('post')
  set setPost(val: object) {
    this.post = val;
  }

  constructor(
    private router: Router,
    private auth: AuthService,
    private modalService: NgbModal,
    private http: HttpClient,
    private rd: Renderer2,
    private element: ElementRef) { }

  ngOnInit() {
    if (!this.auth.isAuth()) {
      this.router.navigate(['/signin']);
    }
    if (!this.post) {
      this.post = {
        title: 'no such post',
        content: 'no such pos',
        author: '',
      };
    }
  }


  @HostListener('click', ['$event'])
  onClick(event: Event) {
    const targetElemnt = event.target as Element;
    if (targetElemnt.className !== 'col' && targetElemnt.className !== 'row') {
      this.popUpWindow();
    }
  }

  popUpWindow() {
    const modalRef = this.modalService.open(
      PostModalContent, { backdrop: 'static', windowClass: 'postContentClass', centered: true });
    modalRef.componentInstance.post = Object.assign({}, this.post);
    modalRef.componentInstance.isEditable = (this.post.author === this.auth.getAuth().id);
    modalRef.result.then((result) => {
      if (!result.done) {
        this.post = result.post;
      }
    }).catch((error) => {
      console.log(error);
    }
    );
  }

}
