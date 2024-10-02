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

    // API calls
    forkJoin([
      this.commonService.getJsonData(),
      this.partnerService.getPartner(),
    ]).subscribe({
      next: ([jsonData, partnerData]: any) => {
        console.log(partnerData.payload);

        this.inventoryFeedData = partnerData.payload.inventoryDetails;
        this.patchFormValue(this.inventoryFeedData);
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
  newAuthorizedFeedSender() {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Add authorized feed sender
  addAuthorizedFeedSender() {
    this.authorizedFeedSenders.push(this.newAuthorizedFeedSender());
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
      const emailFormGroup = new FormGroup({
        email: new FormControl(email), // Create a FormControl for email
      });
      this.authorizedFeedSenders.push(emailFormGroup); // Push FormGroup into FormArray
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
                this.patchFormValue(res.payload.inventoryDetails);
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
      Object.values(this.inventoryFeedForm.controls).forEach((control) => {
        if (control.invalid) {
          if (control instanceof FormControl) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }

          if (control instanceof FormArray) {
            control.controls.forEach((formGroup: any) => {
              Object.values(formGroup.controls).forEach((arrayControl: any) => {
                if (arrayControl.invalid) {
                  arrayControl.markAsDirty();
                  arrayControl.updateValueAndValidity({ onlySelf: true });
                }
              });
            });
          }
        }
      });
    }
  }

  // Navigate back
  goBack() {
    this.router.navigate(['/main/setting']);
  }
}
