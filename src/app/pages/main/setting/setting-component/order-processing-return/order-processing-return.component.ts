import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EnabledCarriersOptions } from 'src/app/shared/constants/constants';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';

@Component({
  selector: 'app-order-processing-return',
  templateUrl: './order-processing-return.component.html',
  styleUrls: ['./order-processing-return.component.scss'],
})
export class OrderProcessingReturnComponent implements OnInit {
  isLoading: boolean = false;
  orderProcessingReturnForm!: FormGroup;
  dropDownList: any = null;
  enabledCarriersOptions: { name: string; value: string }[] =
    EnabledCarriersOptions;
  generateLabelsList = [
    { name: '123Stores Shipping Label', value: 1 },
    { name: '123Stores 3rd Party Account', value: 0 },
  ];
  formFieldOnUI = {
    poSendingMethod: true,
    enabledCarriers: true,
    generateLabels: true,
    labelPageSize: true,
    copyOfPOSentOverEmail: true,
    authorizedInvoiceSenders: true,
    isPackingSlipEnabled: true,
  };

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private formValidationService: FormValidationService
  ) {}

  ngOnInit(): void {
    this.commonService.getJsonData().subscribe(
      (res) => {
        this.dropDownList = res;
        // this.formControl['inventoryFeedType'].setValue(1);
        // this.formControl['inventoryFeedDetailType'].setValue(1);
        // this.formControl['inventoryBucket'].setValue(2);
      },
      (error) => {
        console.error('Error fetching JSON data', error);
      }
    );

    this.orderProcessingReturnForm = this.fb.group({
      poSendingMethod: ['', [Validators.required]],
      enabledCarriers: [[], [Validators.required]],
      generateLabels: ['', [Validators.required]],
      labelPageSize: ['', [Validators.required]],
      copyOfPOSentOverEmail: ['', [Validators.required]],
      isPackingSlipEnabled: ['', [Validators.required]],
      authorizedInvoiceSenders: this.fb.array([]),
    });
    this.addAuthorizedFeedSender();

    this.orderProcessingReturnForm?.valueChanges.subscribe((selectedValues) => {
      this.onFormChange();
    });
  }

  get formControl() {
    return this.orderProcessingReturnForm.controls;
  }

  get authorizedInvoiceSenders(): FormArray {
    return this.orderProcessingReturnForm.controls[
      'authorizedInvoiceSenders'
    ] as FormArray;
  }

  onFormChange(): void {
    if (this.formControl['poSendingMethod'].value === 1) {
      this.formFieldOnUI['copyOfPOSentOverEmail'] = true;
    } else {
      this.formFieldOnUI['copyOfPOSentOverEmail'] = false;
    }

    if (this.formControl['generateLabels'].value === 1) {
      this.formFieldOnUI['labelPageSize'] = true;
    } else {
      this.formFieldOnUI['labelPageSize'] = false;
    }
  }

  newAuthorizedFeedSender() {
    return this.fb.group({
      email: ['', [Validators.required]],
    });
  }

  addAuthorizedFeedSender() {
    this.authorizedInvoiceSenders.push(this.newAuthorizedFeedSender());
  }

  removeAuthorizedFeedSender(i: number) {
    this.authorizedInvoiceSenders.removeAt(i);
  }

  reset() {
    for (let index = 0; index < this.authorizedInvoiceSenders.length; index++) {
      this.authorizedInvoiceSenders.removeAt(0);
    }

    this.orderProcessingReturnForm?.reset();
    this.formControl['inventoryFeedType'].setValue(1);
    this.formControl['inventoryFeedDetailType'].setValue(1);
    this.formControl['inventoryBucket'].setValue(2);
    if (this.authorizedInvoiceSenders.length === 0) {
      this.addAuthorizedFeedSender();
    }
  }

  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.orderProcessingReturnForm,
      this.formFieldOnUI
    );
    if (valid) {
      this.isLoading = true;
      const payload = {
        // inventoryFeedType: this.formFieldOnUI['inventoryFeedType']
        //   ? this.formControl['inventoryFeedType'].value
        //   : '',

        authorizedInvoiceSenders: this.formFieldOnUI['authorizedInvoiceSenders']
          ? this.formControl['authorizedInvoiceSenders'].value?.map(
              (item: any) => item?.email
            )
          : '',
      };
      setTimeout(() => {
        console.log(payload);
        this.isLoading = false;
      }, 500);
    } else {
      Object.values(this.orderProcessingReturnForm.controls).forEach(
        (control) => {
          if (control.invalid) {
            if (control instanceof FormControl) {
              control.markAsDirty();
              control.updateValueAndValidity({ onlySelf: true });
            }

            if (control instanceof FormArray) {
              control.controls.forEach((formGroup: any) => {
                Object.values(formGroup.controls).forEach(
                  (arrayControl: any) => {
                    if (arrayControl.invalid) {
                      arrayControl.markAsDirty();
                      arrayControl.updateValueAndValidity({ onlySelf: true });
                    }
                  }
                );
              });
            }
          }
        }
      );
    }
  }

  goBack() {
    window.history.back();
  }
}
