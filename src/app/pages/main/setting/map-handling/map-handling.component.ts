import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';

@Component({
  selector: 'app-map-handling',
  templateUrl: './map-handling.component.html',
  styleUrls: ['./map-handling.component.scss'],
})
export class MapHandlingComponent implements OnInit {
  isLoading: boolean = false;
  mapHandlingForm!: FormGroup;
  dropDownList: any = null;
  formFieldOnUI = {
    mapType: true,
    handlingConfiguration: true,
    accountHandlingTimeValue: true,
  };

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private formValidationService: FormValidationService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.commonService.getJsonData().subscribe(
      (res) => {
        this.dropDownList = res;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching JSON data', error);
        this.isLoading = false;
      }
    );
    this.mapHandlingForm = this.formBuilder.group({
      mapType: ['', [Validators.required]],
      handlingConfiguration: ['', [Validators.required]],
      accountHandlingTimeValue: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(10),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
    });

    this.mapHandlingForm?.valueChanges.subscribe((value) => {
      this.onFormChange();
    });
  }

  get formControl() {
    return this.mapHandlingForm.controls;
  }

  onFormChange(): void {
    if (this.formControl['handlingConfiguration'].value === 2) {
      this.formFieldOnUI['accountHandlingTimeValue'] = false;
    } else {
      this.formFieldOnUI['accountHandlingTimeValue'] = true;
    }
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
      const payload = {
        mapType: this.formFieldOnUI['mapType']
          ? this.mapHandlingForm?.value?.mapType
          : '',
        handlingConfiguration: this.formFieldOnUI['handlingConfiguration']
          ? this.mapHandlingForm?.value?.handlingConfiguration
          : '',
        accountHandlingTimeValue: this.formFieldOnUI['accountHandlingTimeValue']
          ? this.mapHandlingForm?.value?.accountHandlingTimeValue
          : '',
      };
      setTimeout(() => {
        console.log(payload);
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
