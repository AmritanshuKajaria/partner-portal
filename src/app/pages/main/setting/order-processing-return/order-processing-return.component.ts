import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  EnabledCarriersOptions,
  ReturnProfileOptions,
} from 'src/app/shared/constants/constants';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin } from 'rxjs';
import { PartnerService } from 'src/app/shared/service/partner.service';

@Component({
  selector: 'app-order-processing-return',
  templateUrl: './order-processing-return.component.html',
  styleUrls: ['./order-processing-return.component.scss'],
})
export class OrderProcessingReturnComponent implements OnInit {
  isLoading: boolean = false;
  isSaving: boolean = false;
  orderProcessingReturnForm!: FormGroup;
  dropDownList: any = null;
  orderProcessingReturnData: any;
  returnDetails: any;
  enabledCarriersOptions: {
    name: string;
    value: string;
    disabled: boolean;
  }[] = EnabledCarriersOptions;
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
    returnProfile: true,
  };
  returnProfileOptions = [
    { name: 'Return To Partner Location', value: 1 },
    { name: 'Field Destroy', value: 2 },
  ];

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
    private router: Router,
    private partnerService: PartnerService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    // Initialize form
    this.orderProcessingReturnForm = this.fb.group({
      poSendingMethod: [{ value: '', disabled: true }],
      enabledCarriers: [[], [Validators.required]],
      generateLabels: [{ value: '', disabled: true }],
      labelPageSize: ['', [Validators.required]],
      copyOfPOSentOverEmail: [''],
      isPackingSlipEnabled: [{ value: true, disabled: true }],
      authorizedInvoiceSenders: this.fb.array([]),
      returnProfile: [{ value: '', disabled: true }],
    });
    this.addAuthorizedFeedSender();

    // Set value change listner on form
    this.orderProcessingReturnForm?.valueChanges.subscribe((selectedValues) => {
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
        this.isLoading = false;
        this.orderProcessingReturnData = res.payload.fulfillmentDetails;
        this.returnDetails = res.payload.returnDetails;
        this.patchFormValue(this.orderProcessingReturnData);
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
    return this.orderProcessingReturnForm.controls;
  }

  get authorizedInvoiceSenders(): FormArray {
    return this.orderProcessingReturnForm.controls[
      'authorizedInvoiceSenders'
    ] as FormArray;
  }

  // Handle hide show inputs
  onFormChange(): void {
    if (this.formControl['poSendingMethod'].value === 2) {
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

  // Create new authorized feed sender
  newAuthorizedFeedSender(value?: string | undefined) {
    return this.fb.group({
      email: [
        value ?? '',
        [Validators.required, Validators.email, Validators.maxLength(255)],
      ],
    });
  }

  // Add authorized feed sender
  addAuthorizedFeedSender(value?: string | undefined) {
    this.authorizedInvoiceSenders.push(this.newAuthorizedFeedSender(value));
  }

  // Remove authorized feed sender
  removeAuthorizedFeedSender(i: number) {
    this.authorizedInvoiceSenders.removeAt(i);
  }

  // Reset form
  reset() {
    for (let index = 0; index < this.authorizedInvoiceSenders.length; index++) {
      this.authorizedInvoiceSenders.removeAt(0);
    }

    this.orderProcessingReturnForm?.reset();
    if (this.authorizedInvoiceSenders.length === 0) {
      this.addAuthorizedFeedSender();
    }
    this.patchFormValue(this.orderProcessingReturnData);
  }

  // Patch value to the form
  patchFormValue(data: any) {
    this.formControl['poSendingMethod'].setValue(Number(data?.poSendingMethod));
    this.formControl['generateLabels'].setValue(Number(data?.generateLabels));
    this.formControl['enabledCarriers'].setValue(data?.enabledCarriers);
    this.formControl['isPackingSlipEnabled'].setValue(
      data?.isPackingSlipEnabled
    );
    this.formControl['labelPageSize'].setValue(Number(data?.labelPageSize));
    this.formControl['copyOfPOSentOverEmail'].setValue(
      data?.copyOfPOSentOverEmail
    );
    this.formControl['returnProfile'].setValue(
      this.returnDetails?.returnProfileType <= 5 ? 1 : 2
    );

    this.authorizedInvoiceSenders.clear();
    data.authorizedInvoiceSenders.forEach((email: any) => {
      this.addAuthorizedFeedSender(email);
    });
  }

  // Submit form
  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.orderProcessingReturnForm,
      this.formFieldOnUI
    );

    if (valid) {
      this.isSaving = true;
      const payload = {
        poSendingMethod: this.formFieldOnUI['poSendingMethod']
          ? this.formControl['poSendingMethod']?.value
          : '',
        enabledCarriers: this.formFieldOnUI['enabledCarriers']
          ? this.formControl['enabledCarriers']?.value
          : '',
        generateLabels: this.formFieldOnUI['generateLabels']
          ? this.formControl['generateLabels']?.value
          : '',
        labelPageSize: this.formFieldOnUI['labelPageSize']
          ? this.formControl['labelPageSize']?.value
          : '',
        copyOfPOSentOverEmail: this.formFieldOnUI['copyOfPOSentOverEmail']
          ? this.formControl['copyOfPOSentOverEmail']?.value
          : '',
        isPackingSlipEnabled: this.formFieldOnUI['isPackingSlipEnabled']
          ? this.formControl['isPackingSlipEnabled']?.value
          : '',
        authorizedInvoiceSenders: this.formFieldOnUI['authorizedInvoiceSenders']
          ? this.formControl['authorizedInvoiceSenders'].value?.map(
              (item: any) => item?.email
            )
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
  }

  goBack() {
    this.router.navigate(['/main/setting']);
  }
}
