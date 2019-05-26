import { Component, OnInit, Input, ElementRef, HostListener, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { editorOptions } from '../quill/quill-config';
import { ImageBlot } from '../quill/block-image';
import Quill from 'quill';

import { PostModalComponent } from '../post-modal/post-modal.component';

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
  @Input() overview = false;
  @Input() isEdit = false;
  @Input('post')
  set setPost(val: object) { this.data = val;}
  @ViewChild('title') titleController;
  @ViewChild('content') contentController;

  constructor(private element: ElementRef, public dialog: MatDialog) {
    ImageBlot.blotName = 'bimage';
    ImageBlot.tagName = 'img';
    ImageBlot.className = 'imgcenter';
    Quill.register(ImageBlot, true);
  }

  ngOnInit() {
  }

  validate() {
    if (this.contentController.valid && this.titleController.valid) {
      return true;
    } else {
      this.titleController.control.pristine = false;
      this.contentController.control.pristine = false;
      return false;
    }
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
      height: '70vh',
      data: {
        title: this.data.title,
        content: this.data.content,
        modifyDate: this.data.modifyDate
      }
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
