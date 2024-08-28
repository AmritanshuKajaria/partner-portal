import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';

@Component({
  selector: 'app-coi',
  templateUrl: './coi.component.html',
  styleUrls: ['./coi.component.scss'],
})
export class COIComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isLoading: boolean = false;
  mapHandlingForm!: FormGroup;
  dropDownList: any = null;
  formFieldOnUI = {
    insurerName: true,
    insuredName: true,
    policyNumber: true,
    policyStartDate: true,
    policyEndDate: true,
    coiFileID: true,
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
    this.mapHandlingForm = this.formBuilder.group({
      insurerName: [{ value: '', disabled: true }],
      insuredName: [{ value: '', disabled: true }],
      policyNumber: [{ value: '', disabled: true }],
      policyStartDate: [{ value: '', disabled: true }],
      policyEndDate: [{ value: '', disabled: true }],
      coiFileID: [{ value: '', disabled: true }],
    });

    // this.mapHandlingForm?.valueChanges.subscribe((value) => {
    //   this.onFormChange();
    // });
  }

  get formControl() {
    return this.mapHandlingForm.controls;
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.formControl['policyEndDate']?.value) {
      return false;
    }
    return (
      startValue.getTime() > this.formControl['policyEndDate']?.value.getTime()
    );
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.formControl['policyStartDate']?.value) {
      return false;
    }
    return (
      endValue.getTime() <= this.formControl['policyStartDate']?.value.getTime()
    );
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
    console.log('handleStartOpenChange', open);
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }

  reset() {
    this.mapHandlingForm?.reset();
  }

  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.mapHandlingForm,
      this.formFieldOnUI
    );

    if (valid) {
      this.isLoading = true;
      // const payload = {
      //   mapType: this.formFieldOnUI['mapType']
      //     ? this.mapHandlingForm?.value?.mapType
      //     : '',
      //   handlingConfiguration: this.formFieldOnUI['handlingConfiguration']
      //     ? this.mapHandlingForm?.value?.handlingConfiguration
      //     : '',
      //   accountHandlingTimeValue: this.formFieldOnUI['accountHandlingTimeValue']
      //     ? this.mapHandlingForm?.value?.accountHandlingTimeValue
      //     : '',
      // };
      setTimeout(() => {
        // console.log(payload);
        this.isLoading = false;
      }, 500);
    } else {
      Object.values(this.mapHandlingForm.controls).forEach((control) => {
        if (control.invalid) {
          if (control instanceof FormControl) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        }
      });
    }
  }

  goBack() {
    window.history.back();
  }
}
