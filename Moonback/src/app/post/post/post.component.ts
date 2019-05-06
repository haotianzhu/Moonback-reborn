import { Component, OnInit, Input, HostListener, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../authentication/shared/auth.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-post-modal-content',
  template: `
    <div class='d-flex flex-column bd-highlight mb-3 justify-content-center'>
    <div class="mb-3 border-primary">
      <div class="modal-header">{{post.title}}</div>
      <div class="modal-body text-dark ">
          <div [innerHTML]="post.content"></div>
          <p class="card-text"><small class="text-muted">Last updated {{post.modifyDate}}</small></p>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
    </div>
  `
})

export class PostModalContent {  
  @Input() post;

  constructor(public activeModal: NgbActiveModal) { }
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
    private rd: Renderer2,
    private element: ElementRef) { }

  ngOnInit() {
    if (!this.auth.isAuth()) {
      this.router.navigate(['/signin']);
    }

    if (!this.post) {
      this.post = {
        title: 'fake',
        content: 'no'
      };
    }
  }

  ngAfterViewInit(): void {
    // add img class card-img
    const imgNodeList = this.element.nativeElement.querySelectorAll('div[name=post-content] img') as NodeList;
    if (imgNodeList.length > 0) {
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
    const modalRef = this.modalService.open(PostModalContent, { size: 'lg', centered: true });
    modalRef.componentInstance.post = this.post;
  }

}
