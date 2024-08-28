import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';

@Component({
  selector: 'app-primary-info',
  templateUrl: './primary-info.component.html',
  styleUrls: ['./primary-info.component.scss'],
})
export class PrimaryInfoComponent implements OnInit {
  isLoading: boolean = false;
  primaryInfoForm!: FormGroup;
  dropDownList: any = null;
  formFieldOnUI = {
    displayName: true,
    accountManagerName: true,
    accountStatus: true,
    salesStatus: true,
    paymentStatus: true,
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
    this.primaryInfoForm = this.formBuilder.group({
      displayName: ['Tachikara (TAC)', [Validators.required]],
      accountManagerName: [{ value: 'Shiv', disabled: true }],
      accountStatus: [{ value: 1, disabled: true }],
      salesStatus: [{ value: 1, disabled: true }],
      paymentStatus: [{ value: 2, disabled: true }],
    });
  }

  get formControl() {
    return this.primaryInfoForm.controls;
  }

  reset() {
    this.primaryInfoForm?.reset();
  }

  submitForm() {
    this.isLoading = true;
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
      salesStatus: this.formFieldOnUI['salesStatus']
        ? this.formControl['salesStatus']?.value
        : '',
      paymentStatus: this.formFieldOnUI['paymentStatus']
        ? this.formControl['paymentStatus']?.value
        : '',
    };
    setTimeout(() => {
      console.log(payload);
      this.isLoading = false;
    }, 500);
  }

  goBack() {
    window.history.back();
  }
}