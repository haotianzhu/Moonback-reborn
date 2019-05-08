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
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-post-modal-content',
  templateUrl: './post.content.html',
})

export class PostModalContent {  // tslint:disable-line:component-class-suffix
  @Input() post;
  @Input() isEditable;
  isEditMode = false;

  constructor(public activeModal: NgbActiveModal) {
  }

  onSave() {
    this.activeModal.close({ done: false, post: this.post });
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
export class PostComponent implements OnInit, AfterViewInit {

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

  ngAfterViewInit(): void {
    // add img class card-img
    this.settingImg();
  }

  settingImg() {
    const imgNodeList = this.element.nativeElement.querySelectorAll('div[name=post-content] img') as NodeList;
    if (imgNodeList.length > 0) {
      console.log(imgNodeList);
      imgNodeList.forEach((element: Element) => {
        element.classList.add('card-img');
      });
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
    const modalRef = this.modalService.open(PostModalContent, { backdrop: 'static', size: 'lg', centered: true });
    modalRef.componentInstance.post = Object.assign({}, this.post);
    modalRef.componentInstance.isEditable = (this.post.author === this.auth.getAuth().id);
    modalRef.result.then(async (result) => {
      if (result && result.done) {
        return;
      } else if (result && !result.done) {
        if (result.post) {
          await this.http.patch<any>(
            `${environment.baseUrl + 'posts/' + this.post.id}`, { post: result.post },
            { observe: 'response' }
          ).subscribe((res) => {
            if (res.status === 200) {
              const data = res.body;
              if (data && data) {
                this.post = data.post;
              } else {
                throw Error('http error no new post data return');
              }
            } else {
              Error(`${'http error' + res.status}`);
            }
          });
          await this.settingImg();
        } else {
          throw Error('no new post data');
        }
      } else {
        throw Error('unknow result');
      }
    },
      (reason) => { console.log(reason); }
    ).catch((error) => {
      console.log(error);
    }
    );
  }

}
