import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { resText } from 'src/app/shared/constants/constants';
import { ApiResponse } from 'src/app/shared/model/common.model';
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
  @Input() ReclassifyReturn: boolean = false;
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
      type: this.type,
      cn: this.uploadCreditNoteForm.controls['cn'].value,
      uploaded_file: this.selectFile,
    };
    const data = new FormData();
    data.append('po_no', creditNoteData.po_no);
    data.append('credit_note_no', creditNoteData.cn);
    data.append(
      'uploaded_file',
      creditNoteData.uploaded_file ? creditNoteData.uploaded_file : ''
    );
    data.append('type', creditNoteData.type);

    if (!this.ReclassifyReturn) {
      this.returnService.approveReturn(data).subscribe({
        next: (result: ApiResponse) => {
          this.isLoading = false;
          if (result.success) {
            this.message.success(resText);
            this.close();
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Approve credit request Failed!'
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
    } else {
      this.returnService.reclassifyReturn(data).subscribe({
        next: (result: ApiResponse) => {
          this.isLoading = false;
          if (result.success) {
            this.message.success(resText);
            this.close();
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Reclassify Return request Failed!'
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
