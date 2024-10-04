import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import {
  CanadaStates,
  FederalTaxClassificationOption,
  USStates,
} from 'src/app/shared/constants/constants';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';
import { PartnerService } from 'src/app/shared/service/partner.service';

@Component({
  selector: 'app-legal-info',
  templateUrl: './legal-info.component.html',
  styleUrls: ['./legal-info.component.scss'],
})
export class LegalInfoComponent implements OnInit {
  isLoading: boolean = false;
  legalInfoForm!: FormGroup;
  dropDownList: any = null;
  legalInfoData: any;
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
    fileId: '',
    name: 'W9 File',
    // uid: '-1',
    // status: 'done',
    // url: 'https://example.com/path-to-your-file.pdf',
  };

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private partnerService: PartnerService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    // Initialize form
    this.legalInfoForm = this.fb.group({
      documentType: [{ value: '', disabled: true }],
      formRevisionNumber: [{ value: '', disabled: true }],
      legalName: [{ value: '', disabled: true }],
      businessName: [{ value: '', disabled: true }],
      federalTaxClassification: [{ value: '', disabled: true }],
      officialAddressLine1: [{ value: '', disabled: true }],
      officialAddressLine2: [{ value: '', disabled: true }],
      officialCity: [{ value: '', disabled: true }],
      tinNumber: [{ value: '', disabled: true }],
      officialZipCode: [{ value: '', disabled: true }],
      tinType: [{ value: '', disabled: true }],
      officialCountry: [{ value: '', disabled: true }],
      officialState: [{ value: '', disabled: true }],
      w9SigningDate: [{ value: '', disabled: true }],
      w9FileID: [{ value: '', disabled: true }],
    });

    // Set value change listner on form
    this.legalInfoForm?.valueChanges.subscribe((selectedValues) => {
      this.onFormChange();
    });

    // Get Constants JSON
    this.commonService.getJsonData().subscribe({
      next: (res) => {
        this.dropDownList = res;
      },
    });

    // API calls
    this.getPartnersAndPatchForm();
  }

  getPartnersAndPatchForm() {
    this.isLoading = true;
    this.partnerService.getPartner().subscribe({
      next: (res: any) => {
        this.legalInfoData = res.payload.legalInfo;
        this.patchFormValue(this.legalInfoData);
        this.isLoading = false;
      },
      error: (error) => {
        this.message.create(
          'error',
          error?.error_message?.[0] || 'Something went wrong fetching the data'
        );
        this.isLoading = false;
      },
    });
  }

  // Get Form Control
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

  // downloadFile(file: NzUploadFile): void {
  downloadFile(data: any) {
    this.partnerService.getPartnerPdf(data?.fileId).subscribe({
      next: (res: any) => {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = res?.url;
        link.download = this.fileList?.name;
        link.click();
      },
      error: (error: any) => {
        this.message.create(
          'error',
          error?.error_message?.[0] || 'Data Update failed!'
        );
      },
    });
  }

  // Handle hide show inputs
  onFormChange() {
    if (this.formControl['documentType']?.value === 2) {
      this.countryList = ['CA'];
      this.formFieldOnUI['usState'] = false;
    } else {
      this.countryList = ['US', 'CA'];
      this.formFieldOnUI['usState'] = true;
    }
  }

  // Reset form
  reset() {
    this.legalInfoForm?.reset();
  }

  // Patch Form Value
  patchFormValue(data: any) {
    this.formControl['documentType'].setValue(Number(data?.documentType));
    this.formControl['formRevisionNumber'].setValue(data?.formRevisionNumber);
    this.formControl['legalName'].setValue(data?.legalName);
    this.formControl['businessName'].setValue(data?.businessName);
    this.formControl['federalTaxClassification'].setValue(
      data?.federalTaxClassification
    );
    this.formControl['tinType'].setValue(Number(data?.tinType));
    this.formControl['tinNumber'].setValue(data?.tinNumber);
    this.formControl['w9SigningDate'].setValue(data?.w9SigningDate);
    this.formControl['officialAddressLine1'].setValue(
      data?.officialAddressLine1
    );
    this.formControl['officialAddressLine2'].setValue(
      data?.officialAddressLine2
    );
    this.formControl['officialCity'].setValue(data?.officialCity);
    this.formControl['officialState'].setValue(data?.officialState);
    this.formControl['officialZipCode'].setValue(data?.officialZipCode);
    this.formControl['officialCountry'].setValue(data?.officialCountry);
    this.formControl['w9FileID'].setValue(data?.w9FileID);
    this.fileList.fileId = data?.w9FileID;
  }

  // Submit form
  submitForm() {
    this.isLoading = true;
    const payload = {
      // inventoryFeedType: this.formFieldOnUI['inventoryFeedType']
      //   ? this.formControl['inventoryFeedType'].value
      //   : '',
    };
    this.isLoading = false;
  }

  // Navigate back
  goBack() {
    this.router.navigate(['/main/setting']);
  }
}
