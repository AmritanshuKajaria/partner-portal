import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApproveReturnPayload } from 'src/app/shared/model/returns.model';
import { ReturnService } from 'src/app/shared/service/return.service';

@Component({
  selector: 'app-upload-credit-note',
  templateUrl: './upload-credit-note.component.html',
  styleUrls: ['./upload-credit-note.component.scss'],
})
export class UploadCreditNote implements OnInit {
  @Input() poNo: string = '';
  @Input() type: string = '';
  @Output() closeModal = new EventEmitter();

  uploadCreditNoteForm!: FormGroup;
  isLoading: boolean = false;
  selectFile: any;

  constructor(
    private returnService: ReturnService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.uploadCreditNoteForm = new FormGroup({
      cn: new FormControl('', Validators.required),
      uploadCreditNote: new FormControl(''),
    });
  }

  close() {
    this.closeModal.emit();
  }

  submitForm() {
    if (this.uploadCreditNoteForm.invalid) {
      for (const i in this.uploadCreditNoteForm.controls) {
        this.uploadCreditNoteForm.controls[i].markAsDirty();
        this.uploadCreditNoteForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    this.isLoading = true;
    const creditNoteData: ApproveReturnPayload = {
      po_no: this.poNo,
      cn: this.uploadCreditNoteForm.controls['cn'].value,
      uploaded_file: this.selectFile,
    };
    const data = new FormData();
    data.append('po_no', creditNoteData.po_no);
    data.append('cn', creditNoteData.cn);
    data.append('uploaded_file', this.selectFile);

    if (this.type === 'approveReturn') {
      this.returnService.approveReturn(data).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            this.message.success('Approve credit request successfully!');
            this.close();
          } else {
            this.message.error(
              res?.error_message
                ? res?.error_message
                : 'Approve credit request Failed!'
            );
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          if (!error?.error_shown) {
            this.message.error('Approve credit request Failed!');
          }
        },
      });
    } else if (this.type === 'reclassifyReturn') {
      this.returnService.reclassifyReturn(data).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            this.message.success('Reclassify Return request successfully!');
            this.close();
          } else {
            this.message.error(
              res?.error_message
                ? res?.error_message
                : 'Reclassify Return request Failed!'
            );
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          if (!error?.error_shown) {
            this.message.error('Reclassify Return request Failed!');
          }
        },
      });
    }
  }

  selectFiles(event: any) {
    this.selectFile = event?.target?.files[0];
  }
}
