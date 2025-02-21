import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PartnerService } from 'src/app/shared/service/partner.service';
import { ApiResponse } from 'src/app/shared/model/common.model';

@Component({
  selector: 'app-remittance-info',
  templateUrl: './remittance-info.component.html',
  styleUrls: ['./remittance-info.component.scss'],
})
export class RemittanceInfoComponent implements OnInit {
  isLoading: boolean = false;
  remittanceInfoForm!: FormGroup;
  remittanceInfoData: any;
  formFieldOnUI = {
    accountNumber: true,
    bankName: true,
    nameOnAccount: true,
    routingNumber: true,
    netDays: true,
    discountDays: true,
    discountPercentage: true,
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private partnerService: PartnerService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.remittanceInfoForm = this.formBuilder.group({
      accountNumber: [{ value: '', disabled: true }],
      bankName: [{ value: '', disabled: true }],
      nameOnAccount: [{ value: '', disabled: true }],
      routingNumber: [{ value: '', disabled: true }],
      netDays: [{ value: '', disabled: true }],
      discountDays: [{ value: '', disabled: true }],
      discountPercentage: [{ value: '', disabled: true }],
    });

    // API calls
    this.getPartnersAndPatchForm();
  }

  getPartnersAndPatchForm() {
    this.isLoading = true;
    this.partnerService.getPartner().subscribe({
      next: (result: ApiResponse) => {
        if (result.success) {
          const res: any = result?.response ?? {};
          this.remittanceInfoData = res;
          this.patchFormValue(this.remittanceInfoData);
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

  // Get Form Control
  get formControl() {
    return this.remittanceInfoForm.controls;
  }

  // Reset form
  reset() {
    this.remittanceInfoForm?.reset();
  }

  // Patch value to the form
  patchFormValue(data: any) {
    let achDetails = data.achDetails;
    let paymentDetails = data.paymentDetails;

    this.formControl['accountNumber'].setValue(achDetails?.accountNumber);
    this.formControl['bankName'].setValue(achDetails?.bankName);
    this.formControl['nameOnAccount'].setValue(achDetails?.nameOnAccount);
    this.formControl['routingNumber'].setValue(achDetails?.routingNumber);

    this.formControl['netDays'].setValue(paymentDetails?.netDays);
    this.formControl['discountDays'].setValue(paymentDetails?.discountDays);
    this.formControl['discountPercentage'].setValue(
      paymentDetails?.discountPercentage
    );
  }

  // Submit form
  submitForm() {
    this.isLoading = true;
    const payload = {
      accountNumber: this.formFieldOnUI['accountNumber']
        ? this.formControl['accountNumber']?.value
        : '',
      bankName: this.formFieldOnUI['bankName']
        ? this.formControl['bankName']?.value
        : '',
      nameOnAccount: this.formFieldOnUI['nameOnAccount']
        ? this.formControl['nameOnAccount']?.value
        : '',
      routingNumber: this.formFieldOnUI['routingNumber']
        ? this.formControl['routingNumber']?.value
        : '',
      netDays: this.formFieldOnUI['netDays']
        ? this.formControl['netDays']?.value
        : '',
      discountDays: this.formFieldOnUI['discountDays']
        ? this.formControl['discountDays']?.value
        : '',
      discountPercentage: this.formFieldOnUI['discountPercentage']
        ? this.formControl['discountPercentage']?.value
        : '',
    };
    this.isLoading = false;
  }

  // Navigate back
  goBack() {
    this.router.navigate(['/main/setting']);
  }
}
