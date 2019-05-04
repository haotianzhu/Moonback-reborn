import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'post-modal-content',
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

  constructor(public activeModal: NgbActiveModal) {}
}


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  post : any;

  @Input('post')
  set setPost(val: object){
    this.post = val;
  }

  constructor(private router: Router, private auth: AuthService, private modalService: NgbModal) { }

  ngOnInit() {
    if (!this.auth.isAuth()) {
      this.router.navigate(['/signin'])
    }
    if (!this.post) {
      this.post = {
        title : "fake",
        content: "no"
      }
    }
    // console.log(this.router.url)
  }


  @HostListener("click") 
  onClick(){
    // this.router.navigate(['/posts/'+this.post.id])
    this.popUpWindow()
  }

  popUpWindow() {
    const modalRef = this.modalService.open(PostModalContent, { size: 'lg', centered: true });
    modalRef.componentInstance.post = this.post;
  }

}
