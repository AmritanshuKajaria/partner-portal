import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';

@Component({
  selector: 'app-inventory-feed',
  templateUrl: './inventory-feed.component.html',
  styleUrls: ['./inventory-feed.component.scss'],
})
export class InventoryFeedComponent implements OnInit {
  isLoading: boolean = false;
  inventoryFeedForm!: FormGroup;
  dropDownList: any = null;
  formFieldOnUI = {
    inventorySchedule: true,
    inventoryFeedMPN: true,
    inventoryFeedQuantityColumnName: true,
    authorizedFeedSenders: true,
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
      },
      (error) => {
        console.error('Error fetching JSON data', error);
      }
    );

    this.inventoryFeedForm = this.fb.group({
      inventoryFeedType: [{ value: 1, disabled: true }],
      inventoryFeedDetailType: [
        {
          value: 1,
          disabled: true,
        },
      ],
      inventoryBucket: [{ value: 2, disabled: true }],
      inventorySchedule: [[], [Validators.required]],
      inventoryFeedMPN: ['', [Validators.required]],
      inventoryFeedQuantityColumnName: ['', [Validators.required]],
      authorizedFeedSenders: this.fb.array([]),
    });
    this.addAuthorizedFeedSender();

    this.inventoryFeedForm?.valueChanges.subscribe((selectedValues) => {
      this.onFormChange();
    });
  }

  get formControl() {
    return this.inventoryFeedForm.controls;
  }

  get authorizedFeedSenders(): FormArray {
    return this.inventoryFeedForm.controls[
      'authorizedFeedSenders'
    ] as FormArray;
  }

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

  newAuthorizedFeedSender() {
    return this.fb.group({
      email: ['', [Validators.required]],
    });
  }

  addAuthorizedFeedSender() {
    this.authorizedFeedSenders.push(this.newAuthorizedFeedSender());
  }

  removeAuthorizedFeedSender(i: number) {
    this.authorizedFeedSenders.removeAt(i);
  }

  reset() {
    this.inventoryFeedForm?.reset();
  }

  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.inventoryFeedForm,
      this.formFieldOnUI
    );
    if (valid) {
      this.isLoading = true;
      const payload = {
        inventoryFeedType: this.inventoryFeedForm.value?.inventoryFeedType,
        inventoryFeedDetailType:
          this.inventoryFeedForm.value?.inventoryFeedDetailType,
        inventoryBucket: this.inventoryFeedForm.value?.inventoryBucket,
        inventorySchedule: this.formFieldOnUI['inventorySchedule']
          ? this.inventoryFeedForm.value?.inventorySchedule
          : '',
        inventoryFeedMPN: this.formFieldOnUI['inventoryFeedMPN']
          ? this.inventoryFeedForm.value?.inventoryFeedMPN
          : '',
        inventoryFeedQuantityColumnName: this.formFieldOnUI[
          'inventoryFeedQuantityColumnName'
        ]
          ? this.inventoryFeedForm.value?.inventoryFeedQuantityColumnName
          : '',
        authorizedFeedSenders: this.formFieldOnUI['authorizedFeedSenders']
          ? this.inventoryFeedForm.value?.authorizedFeedSenders?.map(
              (item: any) => item?.email
            )
          : '',
      };
      setTimeout(() => {
        console.log(payload);
        this.isLoading = false;
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

  goBack() {
    window.history.back();
  }
}
