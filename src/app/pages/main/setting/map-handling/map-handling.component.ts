import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';
import { PartnerService } from 'src/app/shared/service/partner.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-map-handling',
  templateUrl: './map-handling.component.html',
  styleUrls: ['./map-handling.component.scss'],
})
export class MapHandlingComponent implements OnInit {
  isLoading: boolean = false;
  isSaving: boolean = false;
  mapHandlingForm!: FormGroup;
  dropDownList: any = null;
  mapHandlingData: any;

  // Update this to hide or show inputs on the UI
  formFieldOnUI = {
    mapType: true,
    handlingConfiguration: true,
    accountHandlingTimeValue: true,
  };

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private formValidationService: FormValidationService,
    private router: Router,
    private partnerService: PartnerService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    // Initialize form
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

    // Set value change listner on form
    this.mapHandlingForm?.valueChanges.subscribe((value) => {
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
        this.mapHandlingData = res.payload.catalogDetails;
        this.patchFormValue(this.mapHandlingData);
        this.isLoading = false;
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
    return this.mapHandlingForm.controls;
  }

  // Handle hide show inputs
  onFormChange(): void {
    if (this.formControl['handlingConfiguration'].value === 2) {
      this.formFieldOnUI['accountHandlingTimeValue'] = false;
    } else {
      this.formFieldOnUI['accountHandlingTimeValue'] = true;
    }
  }

  // Reset form
  reset() {
    this.mapHandlingForm?.reset();
    this.patchFormValue(this.mapHandlingData);
  }

  // Patch value to the form
  patchFormValue(data: any) {
    this.formControl['mapType'].setValue(Number(data?.mapType)); // Convert mapType to a number
    this.formControl['handlingConfiguration'].setValue(
      Number(data?.handlingConfiguration)
    ); // Convert handlingConfiguration to a number
    this.formControl['accountHandlingTimeValue'].setValue(
      Number(data?.accountHandlingTimeValue)
    );
  }

  // Submit form
  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.mapHandlingForm,
      this.formFieldOnUI
    );
    console.log(valid);

    if (valid) {
      this.isSaving = true;
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

  // Navigate back
  goBack() {
    this.router.navigate(['/main/setting']);
  }
}
