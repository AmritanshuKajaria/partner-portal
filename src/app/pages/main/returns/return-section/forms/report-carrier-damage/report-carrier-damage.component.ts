import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-report-carrier-damage',
  templateUrl: './report-carrier-damage.component.html',
  styleUrls: ['./report-carrier-damage.component.scss'],
})
export class ReportCarrierDamage implements OnInit {
  @Output() closeModal = new EventEmitter();

  approveCreditForm!: FormGroup;
  loading?: boolean = false;
  isLoading: boolean = false;
  selectFile: any;
  avatarUrl?: string;

  ngOnInit() {
    this.approveCreditForm = new FormGroup({
      uploadCreditNote: new FormControl('', Validators.required),
    });
  }

  close() {
    this.closeModal.emit();
  }

  submitForm() {
    if (this.approveCreditForm.valid) {
      const formValue = this.approveCreditForm.value;
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
