import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-credit-note',
  templateUrl: './upload-credit-note.component.html',
  styleUrls: ['./upload-credit-note.component.scss'],
})
export class UploadCreditNote implements OnInit {
  @Output() closeModal = new EventEmitter();

  uploadCreditNoteForm!: FormGroup;
  isLoading: boolean = false;
  selectFile: any;

  ngOnInit() {
    this.uploadCreditNoteForm = new FormGroup({
      cn: new FormControl(''),
      uploadCreditNote: new FormControl('', Validators.required),
    });
  }

  close() {
    this.closeModal.emit();
  }

  submitForm() {
    if (this.uploadCreditNoteForm.valid) {
      const formValue = this.uploadCreditNoteForm.value;
      console.log('Form Value:', formValue);

      const data = new FormData();
      data.append('cn', formValue.cn);
      data.append('uploadCreditNote', this.selectFile);
      console.log('data:', data);
    }
  }

  selectFiles(event: any) {
    this.selectFile = event?.target?.files[0];
  }
}
