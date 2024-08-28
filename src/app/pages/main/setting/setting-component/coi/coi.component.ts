import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';

@Component({
  selector: 'app-coi',
  templateUrl: './coi.component.html',
  styleUrls: ['./coi.component.scss'],
})
export class COIComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isLoading: boolean = false;
  coiForm!: FormGroup;
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
    uid: '-1',
    name: 'COI File',
    status: 'done',
    url: 'https://example.com/path-to-your-file.pdf',
  };

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private formValidationService: FormValidationService
  ) {}

  ngOnInit(): void {
    this.commonService.getJsonData().subscribe(
      (res) => {
        this.dropDownList = res;
      },
      (error) => {
        console.error('Error fetching JSON data', error);
      }
    );
    this.coiForm = this.formBuilder.group({
      insurerName: [{ value: 'test 1', disabled: true }],
      insuredName: [{ value: 'test 2', disabled: true }],
      policyNumber: [{ value: 12312, disabled: true }],
      policyStartDate: [{ value: '2024-08-22', disabled: true }],
      policyEndDate: [{ value: '2024-08-12', disabled: true }],
      coiFileID: [{ value: '', disabled: true }],
    });

    // this.coiForm?.valueChanges.subscribe((value) => {
    //   this.onFormChange();
    // });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = file;
    return false;
  };

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

  reset() {
    this.fileList = [];
    this.coiForm?.reset();
  }

  downloadFile(file: NzUploadFile): void {
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = this.fileList?.url;
    link.download = this.fileList?.name;
    link.target = '_blank'; // To open in a new tab (optional)
    link.click();
  }

  removeFile(): void {
    this.fileList = null;
  }

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

    console.log({
      insurerName: this.formFieldOnUI['insurerName']
        ? this.formControl['insurerName']?.value
        : '',
      insuredName: this.formFieldOnUI['insuredName']
        ? this.formControl['insuredName']?.value
        : '',
      policyNumber: this.formFieldOnUI['policyNumber']
        ? this.formControl['policyNumber']?.value
        : '',
      policyStartDate: this.formFieldOnUI['policyStartDate']
        ? moment(this.formControl['policyStartDate']?.value).format(
            'YYYY-MM-DD'
          )
        : '',
      policyEndDate: this.formFieldOnUI['policyEndDate']
        ? moment(this.formControl['policyEndDate']?.value).format('YYYY-MM-DD')
        : '',
      coiFileID: this.formFieldOnUI['coiFileID'] ? this.fileList : '',
    });

    setTimeout(() => {
      console.log(formData);
      this.isLoading = false;
    }, 500);
  }

  goBack() {
    window.history.back();
  }
}
