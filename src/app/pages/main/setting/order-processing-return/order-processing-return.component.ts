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

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
    private router: Router,
    private partnerService: PartnerService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
  
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

     // API calls
     forkJoin([
      this.commonService.getJsonData(),
      this.partnerService.getPartner(),
    ]).subscribe({
      next: ([jsonData, partnerData]: any) => {
        console.log(partnerData.payload);

        this.orderProcessingReturnData = partnerData.payload.fulfillmentDetails;
        this.patchFormValue(this.orderProcessingReturnData);
        this.dropDownList = jsonData;
        this.isLoading = false;
      },
      error: (e) => {
        this.message.create('error', 'Something went wrong fetching the data');
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
  newAuthorizedFeedSender() {
    return this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(255)],
      ],
    });
  }

  // Add authorized feed sender
  addAuthorizedFeedSender() {
    this.authorizedInvoiceSenders.push(this.newAuthorizedFeedSender());
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
    this.formControl['poSendingMethod'].setValue(2);
    this.formControl['generateLabels'].setValue(1);
    this.formControl['isPackingSlipEnabled'].setValue(true);
    this.formControl['returnProfile'].setValue('Field Destroy');
    if (this.authorizedInvoiceSenders.length === 0) {
      this.addAuthorizedFeedSender();
    }
    this.patchFormValue(this.orderProcessingReturnData);
  }

   // Patch value to the form
   patchFormValue(data: any) {
    this.formControl['poSendingMethod'].setValue(
      Number(data?.poSendingMethod)
    ); 
    this.formControl['generateLabels'].setValue(
      Number(data?.generateLabels)
    );
    this.formControl['enabledCarriers'].setValue(data?.enabledCarriers);
    this.formControl['isPackingSlipEnabled'].setValue(data?.isPackingSlipEnabled);
    this.formControl['labelPageSize'].setValue(Number(data?.labelPageSize));
    this.formControl['copyOfPOSentOverEmail'].setValue(data?.copyOfPOSentOverEmail);
    this.formControl['returnProfile'].setValue(data?.returnDetails?.returnProfileType);
  

    this.authorizedInvoiceSenders.clear();
    data.authorizedFeedSenders.forEach((email: any) => {
      const emailFormGroup = new FormGroup({
        email: new FormControl(email), // Create a FormControl for email
      });
      this.authorizedInvoiceSenders.push(emailFormGroup); // Push FormGroup into FormArray
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
        returnProfile: this.formFieldOnUI['returnProfile']
          ? this.formControl['returnProfile']?.value
          : '',
        authorizedInvoiceSenders: this.formFieldOnUI['authorizedInvoiceSenders']
          ? this.formControl['authorizedInvoiceSenders'].value?.map(
              (item: any) => item?.email
            )
          : '',
      };
 
      setTimeout(() => {
        console.log('payload::', payload);

        this.partnerService.updatePartner(payload).subscribe({
          next: (res) => {
            this.message.create('success', 'Data Updated Successfully!');
            this.isSaving = false;

            // Fetch the updated partner data after a successful update
            this.isLoading = true;
            this.partnerService.getPartner().subscribe({
              next: (res: any) => {
                this.patchFormValue(res.payload.fulfillmentDetails);
                this.isLoading = false;
              },
              error: (error) => {
                this.message.create(
                  'error',
                  error?.error_message?.[0] ||
                    'Something went wrong fetching the data'
                );
                this.isLoading = false;
              },
            });
          },
          error: (error: any) => {
            this.message.create(
              'error',
              error?.error_message?.[0] || 'Data Update failed!'
            );
            this.isSaving = false; // Ensure saving state is updated on error
          },
        });
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
    this.router.navigate(['/main/setting']);
  }
}
