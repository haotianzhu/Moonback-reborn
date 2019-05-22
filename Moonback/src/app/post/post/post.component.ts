import { Component, OnInit, Input, ElementRef, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PostModalComponent } from '../post-modal/post-modal.component';
import { editorOptions } from '../quill/quill-config';
import Quill from 'quill';
import { ImageBlot } from '../quill/block-image';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  data: any;
  quill: any;
  quillconifg = editorOptions;
  @Input() isView = true;
  @Input() isClickable = false;
  @Input('post')
  set setPost(val: object) {
    this.data = val;
  }

  constructor(private element: ElementRef, public dialog: MatDialog) {
    ImageBlot.blotName = 'bimage';
    ImageBlot.tagName = 'img';
    ImageBlot.className = 'imgcenter';
    Quill.register(ImageBlot, true);
  }


  ngOnInit() {
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.isClickable) {
      const targetElemnt = event.target as Element;
      if (targetElemnt.className !== 'col' && targetElemnt.className !== 'row') {
        this.openModal();
      }
    }
  }
  openModal(): void {
    const dialogRef = this.dialog.open(PostModalComponent, {
      width: '80%',
      maxHeight: '100%',
      data: this.data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  editorCreated(quill: any) {
    this.quill = quill;
    const toolbar = this.quill.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler.bind(this));
  }

  imageHandler() {
    if (this.quill != null) {
      const range = this.quill.getSelection();
      if (range != null) {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.addEventListener('change', () => {
          if (input.files != null) {
            const file = input.files[0];
            if (file != null) {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onerror = (error) => {
                console.log('Error: ', error);
              };
              reader.onloadend = () => {
                // Read complete
                if (reader.readyState === 2) {
                  const base64result = reader.result;
                  this.quill.insertEmbed(range.index, 'bimage', { src: base64result, alt: file.name }, 'user');
                }
              };
            }
          }
        });
        input.click();
      }
    }
  }

}
