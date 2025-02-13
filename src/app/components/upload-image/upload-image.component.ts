import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Input() errorMessage: string = 'Please upload an image';
  @Input() placeholder: string = 'Drag & Drop or Click to Upload';
  @Input() label: string = '';
  @Input() showError: boolean = false;
  @Output() imageSrcChange = new EventEmitter<string | ArrayBuffer | null>();
  imageSrc: string | ArrayBuffer | null = null;

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = reader.result;
        this.imageSrcChange.emit(this.imageSrc);
        this.showError = false;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.imageSrc = null;
    this.fileInput.nativeElement.value = '';
    this.imageSrcChange.emit(this.imageSrc);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = reader.result;
        this.imageSrcChange.emit(this.imageSrc);
        this.showError = false;
      };
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
