import Quill from 'quill';
const BlockEmbed = Quill.import('blots/block/embed');

export class ImageBlot extends BlockEmbed {
  static blotName: string;
  static tagName: string;
  static className: string;
  static create(value) {
    const imgnode = super.create();
    imgnode.setAttribute('alt', value.alt);
    imgnode.setAttribute('src', value.src);
    return imgnode;
  }
  static value(node) {
    return {
      alt: node.getAttribute('alt'),
      url: node.getAttribute('src')
    };
  }
}

