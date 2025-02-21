import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PartnerService } from 'src/app/shared/service/partner.service';
import { ApiResponse } from 'src/app/shared/model/common.model';

@Component({
  selector: 'app-coi',
  templateUrl: './coi.component.html',
  styleUrls: ['./coi.component.scss'],
})
export class COIComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isLoading: boolean = false;
  coiForm!: FormGroup;
  coiData: any;
  dropDownList: any = null;
  formFieldOnUI = {
    insurerName: true,
    insuredName: true,
    policyNumber: true,
    policyStartDate: true,
    policyEndDate: true,
    coiFileID: true,
  };
  fileList: any = {
    fileId: '',
    name: 'COI File',
    // uid: '-1',
    // status: 'done',
    // url: 'https://example.com/path-to-your-file.pdf',
  };

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    private partnerService: PartnerService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.coiForm = this.formBuilder.group({
      insurerName: [{ value: '', disabled: true }],
      insuredName: [{ value: '', disabled: true }],
      policyNumber: [{ value: '', disabled: true }],
      policyStartDate: [{ value: '', disabled: true }],
      policyEndDate: [{ value: '', disabled: true }],
      coiFileID: [{ value: '', disabled: true }],
    });

    // this.coiForm?.valueChanges.subscribe((value) => {
    //   this.onFormChange();
    // });

    // API calls
    this.getPartnersAndPatchForm();
  }

  getPartnersAndPatchForm() {
    this.isLoading = true;
    this.partnerService.getPartner().subscribe({
      next: (result: ApiResponse) => {
        if (result.success) {
          const res: any = result?.response ?? {};
          this.coiData = res.coiConfiguration;
          this.patchFormValue(this.coiData);
        } else {
          this.message.error(result?.msg ? result?.msg : 'Get partner failed!');
        }
        this.isLoading = false;
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Get partner failed!');
        }
        this.isLoading = false;
      },
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = file;
    return false;
  };

  // Get Form Control
  get formControl() {
    return this.coiForm.controls;
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.formControl['policyEndDate']?.value) {
      return false;
    }
    return (
      startValue.getTime() > this.formControl['policyEndDate']?.value.getTime()
    );
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.formControl['policyStartDate']?.value) {
      return false;
    }
    return (
      endValue.getTime() <= this.formControl['policyStartDate']?.value.getTime()
    );
  };

  // Reset Form
  reset() {
    this.fileList = [];
    this.coiForm?.reset();
  }

  // downloadFile(file: NzUploadFile): void {
  downloadFile(data: any) {
    this.partnerService.getPartnerPdf(data?.fileId).subscribe({
      next: (result: ApiResponse) => {
        if (result.success) {
          const res: any = result?.response ?? {};
          // Create a temporary link to download the file
          const link = document.createElement('a');
          link.href = res?.url;
          link.download = this.fileList?.name;
          link.click();
        } else {
          this.message.error(
            result?.msg ? result?.msg : 'Get partner pdf Failed!'
          );
        }
      },
      error: (err: any) => {
        if (!err?.error_shown) {
          this.message.error('Get partner pdf Failed!');
        }
      },
    });
  }

  removeFile(): void {
    this.fileList = null;
  }

  // Patch Form Value
  patchFormValue(data: any) {
    this.formControl['insurerName'].setValue(data?.insurerName);
    this.formControl['insuredName'].setValue(data?.insuredName);
    this.formControl['policyNumber'].setValue(data?.policyNumber);
    this.formControl['policyStartDate'].setValue(
      moment(data?.policyStartDate).isValid() ? data?.policyStartDate : ''
    );
    this.formControl['policyEndDate'].setValue(
      moment(data?.policyEndDate).isValid() ? data?.policyEndDate : ''
    );
    this.formControl['coiFileID'].setValue(data?.coiFileID);
    this.fileList.fileId = data?.coiFileID;
  }

  // Submit Form
  submitForm() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append(
      'insurerName',
      this.formFieldOnUI['insurerName']
        ? this.formControl['insurerName']?.value
        : ''
    );
    formData.append(
      'insuredName',
      this.formFieldOnUI['insuredName']
        ? this.formControl['insuredName']?.value
        : ''
    );
    formData.append(
      'policyNumber',
      this.formFieldOnUI['policyNumber']
        ? this.formControl['policyNumber']?.value
        : ''
    );
    formData.append(
      'policyStartDate',
      this.formFieldOnUI['policyStartDate']
        ? this.formControl['policyStartDate']?.value
          ? moment(this.formControl['policyStartDate']?.value).format(
              'YYYY-MM-DD'
            )
          : ''
        : ''
    );
    formData.append(
      'policyEndDate',
      this.formFieldOnUI['policyEndDate']
        ? this.formControl['policyEndDate']?.value
          ? moment(this.formControl['policyEndDate']?.value).format(
              'YYYY-MM-DD'
            )
          : ''
        : ''
    );
    formData.append(
      'coiFileID',
      this.formFieldOnUI['coiFileID'] ? this.fileList : ''
    );

    this.isLoading = false;
  }

  // Navigate back
  goBack() {
    this.router.navigate(['/main/setting']);
  }
}
