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

@Component({
  selector: 'app-remittance-info',
  templateUrl: './remittance-info.component.html',
  styleUrls: ['./remittance-info.component.scss'],
})
export class RemittanceInfoComponent implements OnInit {
  isLoading: boolean = false;
  remittanceInfoForm!: FormGroup;
  formFieldOnUI = {
    accountNumber: true,
    bankName: true,
    nameOnAccount: true,
    routingNumber: true,
    netDays: true,
    discountDays: true,
    discountPercentage: true,
  };

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.remittanceInfoForm = this.formBuilder.group({
      accountNumber: [{ value: '802653096', disabled: true }],
      bankName: [{ value: 'PNC Banck', disabled: true }],
      nameOnAccount: [{ value: 'LLC', disabled: true }],
      routingNumber: [{ value: '031207607', disabled: true }],
      netDays: [{ value: '10', disabled: true }],
      discountDays: [{ value: '0', disabled: true }],
      discountPercentage: [{ value: '0.00', disabled: true }],
    });
  }

  get formControl() {
    return this.remittanceInfoForm.controls;
  }

  reset() {
    this.remittanceInfoForm?.reset();
  }

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
    setTimeout(() => {
      console.log(payload);
      this.isLoading = false;
    }, 500);
  }

  goBack() {
    this.router.navigate(['/main/setting']);
  }
}
