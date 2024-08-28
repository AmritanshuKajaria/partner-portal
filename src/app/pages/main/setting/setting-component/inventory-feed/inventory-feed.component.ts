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
    private formValidationService: FormValidationService
  ) {}

  ngOnInit(): void {
    this.commonService.getJsonData().subscribe(
      (res) => {
        this.dropDownList = res;
        this.formControl['inventoryFeedType'].setValue(1);
        this.formControl['inventoryFeedDetailType'].setValue(1);
        this.formControl['inventoryBucket'].setValue(2);
      },
      (error) => {
        console.error('Error fetching JSON data', error);
      }
    );

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
      email: ['', [Validators.required, Validators.email]],
    });
  }

  addAuthorizedFeedSender() {
    this.authorizedFeedSenders.push(this.newAuthorizedFeedSender());
  }

  removeAuthorizedFeedSender(i: number) {
    this.authorizedFeedSenders.removeAt(i);
  }

  reset() {
    for (let index = 0; index < this.authorizedFeedSenders.length; index++) {
      this.authorizedFeedSenders.removeAt(0);
    }

    this.inventoryFeedForm?.reset();
    this.formControl['inventoryFeedType'].setValue(1);
    this.formControl['inventoryFeedDetailType'].setValue(1);
    this.formControl['inventoryBucket'].setValue(2);
    if (this.authorizedFeedSenders.length === 0) {
      this.addAuthorizedFeedSender();
    }
  }

  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.inventoryFeedForm,
      this.formFieldOnUI
    );
    if (valid) {
      this.isLoading = true;
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
        inventorySchedule: this.formFieldOnUI['inventorySchedule']
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
