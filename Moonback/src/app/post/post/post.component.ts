import { Component, OnInit, Input, ElementRef, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PostModalComponent } from '../post-modal/post-modal.component';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  data: any;
  @Input() isView = true;

  @Input('post')
  set setPost(val: object) {
    this.data = val;
  }

  constructor(private element: ElementRef, public dialog: MatDialog) { }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    const targetElemnt = event.target as Element;
    if (targetElemnt.className !== 'col' && targetElemnt.className !== 'row') {
      this.openModal('80%');
    }
  }
  openModal(width): void {
    const dialogRef = this.dialog.open(PostModalComponent, {
      width,
      data: this.data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  ngOnInit() {
  }

}
