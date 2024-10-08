import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';
import { PartnerService } from 'src/app/shared/service/partner.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-primary-info',
  templateUrl: './primary-info.component.html',
  styleUrls: ['./primary-info.component.scss'],
})
export class PrimaryInfoComponent implements OnInit {
  isLoading: boolean = false;
  isSaving: boolean = false;

  primaryInfoForm!: FormGroup;
  dropDownList: any = null;
  primaryInfoData: any;
  formFieldOnUI = {
    displayName: true,
    accountManagerName: true,
    accountStatus: true,
    accountReason: false,
    salesStatus: true,
    salesReason: false,
    paymentStatus: true,
    paymentReason: false,
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

    // Initialize form
    this.primaryInfoForm = this.formBuilder.group({
      displayName: ['', [Validators.required]],
      accountManagerName: [{ value: '', disabled: true }],
      accountStatus: [{ value: '', disabled: true }],
      salesStatus: [{ value: '', disabled: true }],
      paymentStatus: [{ value: '', disabled: true }],
      accountReason: [{ value: '', disabled: true }],
      salesReason: [{ value: '', disabled: true }],
      paymentReason: [{ value: '', disabled: true }],
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
        this.primaryInfoData = res.payload;
        this.patchFormValue(this.primaryInfoData);
        this.onFormChange();
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
    return this.primaryInfoForm.controls;
  }

  // Handle hide show inputs
  onFormChange(): void {
    if (this.formControl['accountStatus'].value === 2) {
      this.formFieldOnUI['accountReason'] = true;
    } else {
      this.formFieldOnUI['accountReason'] = false;
    }

    if (this.formControl['salesStatus'].value === 2) {
      this.formFieldOnUI['salesReason'] = true;
    } else {
      this.formFieldOnUI['salesReason'] = false;
    }

    if (this.formControl['paymentStatus'].value === 2) {
      this.formFieldOnUI['paymentReason'] = true;
    } else {
      this.formFieldOnUI['paymentReason'] = false;
    }
  }

  // Reset Form
  reset() {
    this.primaryInfoForm?.reset();
    this.patchFormValue(this.primaryInfoData);
  }

  // Patch Form Value
  patchFormValue(data: any) {
    let partnerDetails = data?.partnerDetails;
    let paymentDetails = data?.paymentDetails;

    this.formControl['displayName'].setValue(partnerDetails?.displayName);
    this.formControl['accountManagerName'].setValue(
      partnerDetails?.accountManagerName
    );
    this.formControl['accountStatus'].setValue(
      Number(partnerDetails?.accountStatus)
    );
    this.formControl['accountReason'].setValue(
      partnerDetails?.accountStatusReason
    );
    this.formControl['salesStatus'].setValue(
      Number(partnerDetails?.salesStatus)
    );
    this.formControl['salesReason'].setValue(partnerDetails?.salesStatusReason);

    this.formControl['paymentStatus'].setValue(
      Number(paymentDetails?.paymentStatus)
    );
    this.formControl['paymentReason'].setValue(
      paymentDetails?.paymentStatusReason
    );
  }

  // Submit Form
  submitForm() {
    this.isSaving = true;
    const payload = {
      displayName: this.formFieldOnUI['displayName']
        ? this.formControl['displayName']?.value
        : '',
      accountManagerName: this.formFieldOnUI['accountManagerName']
        ? this.formControl['accountManagerName']?.value
        : '',
      accountStatus: this.formFieldOnUI['accountStatus']
        ? this.formControl['accountStatus']?.value
        : '',
      accountStatusReason: this.formFieldOnUI['accountReason']
        ? this.formControl['accountReason']?.value
        : '',
      salesStatus: this.formFieldOnUI['salesStatus']
        ? this.formControl['salesStatus']?.value
        : '',
      salesStatusReason: this.formFieldOnUI['salesReason']
        ? this.formControl['salesReason']?.value
        : '',
      paymentStatus: this.formFieldOnUI['paymentStatus']
        ? this.formControl['paymentStatus']?.value
        : '',
      paymentStatusReason: this.formFieldOnUI['paymentReason']
        ? this.formControl['paymentReason']?.value
        : '',
    };

    this.partnerService.updatePartner(payload).subscribe({
      next: (res) => {
        this.message.create('success', 'Data Updated Successfully!');
        this.isSaving = false;

        // Fetch the updated partner data after a successful update
        this.getPartnersAndPatchForm();
      },
      error: (error: any) => {
        this.message.create(
          'error',
          error?.error_message?.[0] || 'Date Update Failed!'
        );
        this.isSaving = false; // Ensure saving state is updated on error
      },
    });
  }

  // Navigate back
  goBack() {
    this.router.navigate(['/main/setting']);
  }
}
