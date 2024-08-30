import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import {
  CanadaStates,
  FederalTaxClassificationOption,
  USStates,
} from 'src/app/shared/constants/constants';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';

@Component({
  selector: 'app-legal-info',
  templateUrl: './legal-info.component.html',
  styleUrls: ['./legal-info.component.scss'],
})
export class LegalInfoComponent implements OnInit {
  isLoading: boolean = false;
  legalInfoForm!: FormGroup;
  dropDownList: any = null;
  federalTaxClassificationOption = FederalTaxClassificationOption;
  formFieldOnUI = {
    documentType: true,
    formRevisionNumber: true,
    legalName: true,
    businessName: true,
    officialAddressLine1: true,
    officialAddressLine2: true,
    officialCity: true,
    tinNumber: true,
    officialZipCode: true,
    federalTaxClassification: true,
    tinType: true,
    officialCountry: true,
    officialState: true,
    w9SigningDate: true,
    w9FileID: true,
    usState: true,
    caState: true,
  };
  usStates = USStates;
  canadaState = CanadaStates;
  countryList = ['US', 'CA'];
  fileList: any = {
    uid: '-1',
    name: 'W9 File',
    status: 'done',
    url: 'https://example.com/path-to-your-file.pdf',
  };

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.commonService.getJsonData().subscribe(
      (res) => {
        this.dropDownList = res;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching JSON data', error);
        this.isLoading = false;
      }
    );

    this.legalInfoForm = this.fb.group({
      documentType: [{ value: 1, disabled: true }],
      formRevisionNumber: [{ value: '2024-03', disabled: true }],
      legalName: [{ value: '4D Concepts Inc', disabled: true }],
      businessName: [{ value: '', disabled: true }],
      federalTaxClassification: [{ value: 'S Corporation', disabled: true }],
      officialAddressLine1: [{ value: '11699 6th Street', disabled: true }],
      officialAddressLine2: [{ value: '', disabled: true }],
      officialCity: [{ value: 'Rancho Cucamonga', disabled: true }],
      tinNumber: [{ value: '203358613', disabled: true }],
      officialZipCode: [{ value: '91730', disabled: true }],
      tinType: [{ value: 2, disabled: true }],
      officialCountry: [{ value: 'US', disabled: true }],
      officialState: [{ value: 'CA', disabled: true }],
      w9SigningDate: [{ value: '2018-07-23', disabled: true }],
      w9FileID: [{ value: '', disabled: true }],
    });

    this.legalInfoForm?.valueChanges.subscribe((selectedValues) => {
      this.onFormChange();
    });
  }

  get formControl() {
    return this.legalInfoForm.controls;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = file;
    return false;
  };

  disabledDate = (current: Date): boolean => {
    const today = new Date();
    if (!current) {
      return false;
    }
    return (
      current &&
      current < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
  };

  downloadFile(file: NzUploadFile): void {
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = this.fileList?.url;
    link.download = this.fileList?.name;
    link.target = '_blank'; // To open in a new tab (optional)
    link.click();
  }

  onFormChange() {
    if (this.formControl['documentType']?.value === 2) {
      // this.formControl['officialCountry']?.setValue('CA');
      // this.formControl['officialState']?.setValue('');
      this.countryList = ['CA'];
      this.formFieldOnUI['usState'] = false;
    } else {
      this.countryList = ['US', 'CA'];
      this.formFieldOnUI['usState'] = true;
    }
  }

  reset() {
    this.legalInfoForm?.reset();
  }

  submitForm() {
    this.isLoading = true;
    const payload = {
      // inventoryFeedType: this.formFieldOnUI['inventoryFeedType']
      //   ? this.formControl['inventoryFeedType'].value
      //   : '',
    };
    setTimeout(() => {
      console.log(payload);
      this.isLoading = false;
    }, 500);
  }

  goBack() {
    this.router.navigate(['/main/setting']);
  }
}
