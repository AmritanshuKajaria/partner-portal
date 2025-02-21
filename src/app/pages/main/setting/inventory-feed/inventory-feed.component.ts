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
import { forkJoin } from 'rxjs';
import { ApiResponse } from 'src/app/shared/model/common.model';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';
import { PartnerService } from 'src/app/shared/service/partner.service';

@Component({
  selector: 'app-inventory-feed',
  templateUrl: './inventory-feed.component.html',
  styleUrls: ['./inventory-feed.component.scss'],
})
export class InventoryFeedComponent implements OnInit {
  isLoading: boolean = false;
  isSaving: boolean = false;
  inventoryFeedForm!: FormGroup;
  dropDownList: any = null;
  inventoryFeedData: any;

  // Update this to hide or show inputs on the UI
  formFieldOnUI = {
    inventoryFeedType: true,
    inventoryFeedDetailType: true,
    inventoryBucket: true,
    inventorySchedule: true,
    inventoryFeedMPN: true,
    inventoryFeedQuantityColumnName: true,
    authorizedFeedSenders: true,
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
    this.inventoryFeedForm = this.fb.group({
      inventoryFeedType: [{ value: '', disabled: true }],
      inventoryFeedDetailType: [
        {
          value: '',
          disabled: true,
        },
      ],
      inventoryBucket: [{ value: '', disabled: true }],
      inventorySchedule: [[], [Validators.required]],
      inventoryFeedMPN: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
        ],
      ],
      inventoryFeedQuantityColumnName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
        ],
      ],
      authorizedFeedSenders: this.fb.array([]),
    });
    this.addAuthorizedFeedSender();

    // Set value change listner on form
    this.inventoryFeedForm?.valueChanges.subscribe((selectedValues) => {
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
      next: (result: ApiResponse) => {
        if (result.success) {
          const res: any = result?.response ?? {};
          this.inventoryFeedData = res.inventoryDetails;
          this.patchFormValue(this.inventoryFeedData);
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
    return this.inventoryFeedForm.controls;
  }

  get authorizedFeedSenders(): FormArray {
    return this.inventoryFeedForm.controls[
      'authorizedFeedSenders'
    ] as FormArray;
  }

  // Handle hide show inputs
  onFormChange(): void {
    if (
      this.formControl['inventoryFeedType'].value === 1 &&
      this.formControl['inventoryFeedDetailType'].value === 1
    ) {
      this.formFieldOnUI['inventoryFeedQuantityColumnName'] = true;
    } else {
      this.formFieldOnUI['inventoryFeedQuantityColumnName'] = false;
    }

    if (this.formControl['inventoryFeedType'].value === 1) {
      this.formFieldOnUI['authorizedFeedSenders'] = true;
      this.formFieldOnUI['inventoryFeedMPN'] = true;
    } else {
      this.formFieldOnUI['authorizedFeedSenders'] = false;
      this.formFieldOnUI['inventoryFeedMPN'] = false;
    }
  }

  // Create new authorized feed sender
  newAuthorizedFeedSender(value?: string | undefined) {
    return this.fb.group({
      email: [value ?? '', [Validators.required, Validators.email]],
    });
  }

  // Add authorized feed sender
  addAuthorizedFeedSender(value?: string | undefined) {
    this.authorizedFeedSenders.push(this.newAuthorizedFeedSender(value));
  }

  // Remove authorized feed sender
  removeAuthorizedFeedSender(i: number) {
    this.authorizedFeedSenders.removeAt(i);
  }

  // Reset form
  reset() {
    for (let index = 0; index < this.authorizedFeedSenders.length; index++) {
      this.authorizedFeedSenders.removeAt(0);
    }
    this.inventoryFeedForm?.reset();
    if (this.authorizedFeedSenders.length === 0) {
      this.addAuthorizedFeedSender();
    }
    this.patchFormValue(this.inventoryFeedData);
  }

  // Patch value to the form
  patchFormValue(data: any) {
    this.formControl['inventoryFeedType'].setValue(
      Number(data?.inventoryFeedType)
    );
    this.formControl['inventoryFeedDetailType'].setValue(
      Number(data?.inventoryFeedDetailType)
    );
    this.formControl['inventoryBucket'].setValue(Number(data?.inventoryBucket));
    this.formControl['inventorySchedule'].setValue(
      data?.inventoryFeedFrequency?.map((value: any) => Number(value)) || []
    );
    this.formControl['inventoryFeedMPN'].setValue(data?.inventoryFeedMPN);
    this.formControl['inventoryFeedQuantityColumnName'].setValue(
      data?.inventoryFeedQuantityColumnName
    );

    this.authorizedFeedSenders.clear();
    data.authorizedFeedSenders.forEach((email: any) => {
      this.addAuthorizedFeedSender(email);
    });
  }

  // Submit form
  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.inventoryFeedForm,
      this.formFieldOnUI
    );
    if (valid) {
      this.isSaving = true;
      const payload = {
        inventoryFeedType: this.formFieldOnUI['inventoryFeedType']
          ? this.formControl['inventoryFeedType'].value
          : '',
        inventoryFeedDetailType: this.formFieldOnUI['inventoryFeedDetailType']
          ? this.formControl['inventoryFeedDetailType'].value
          : '',
        inventoryBucket: this.formFieldOnUI['inventoryBucket']
          ? this.formControl['inventoryBucket'].value
          : '',
        inventoryFeedFrequency: this.formFieldOnUI['inventorySchedule']
          ? this.formControl['inventorySchedule'].value
          : '',
        inventoryFeedMPN: this.formFieldOnUI['inventoryFeedMPN']
          ? this.formControl['inventoryFeedMPN'].value
          : '',
        inventoryFeedQuantityColumnName: this.formFieldOnUI[
          'inventoryFeedQuantityColumnName'
        ]
          ? this.formControl['inventoryFeedQuantityColumnName'].value
          : '',
        authorizedFeedSenders: this.formFieldOnUI['authorizedFeedSenders']
          ? this.formControl['authorizedFeedSenders'].value?.map(
              (item: any) => item?.email
            )
          : '',
      };
      this.partnerService.updatePartner(payload).subscribe({
        next: (result: ApiResponse) => {
          if (result.success) {
            this.message.create('success', 'Data Updated Successfully!');

            // Fetch the updated partner data after a successful update
            this.getPartnersAndPatchForm();
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Date Update Failed!'
            );
          }
          this.isSaving = false;
        },
        error: (err: any) => {
          if (!err?.error_shown) {
            this.message.error('Date Update Failed!');
          }
          this.isSaving = false; // Ensure saving state is updated on error
        },
      });
    }
  }

  // Navigate back
  goBack() {
    this.router.navigate(['/main/setting']);
  }
}
