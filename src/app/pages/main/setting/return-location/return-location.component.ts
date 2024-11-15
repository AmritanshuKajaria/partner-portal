import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  FormAction,
  TimeZone,
  USStates,
} from 'src/app/shared/constants/constants';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PartnerService } from 'src/app/shared/service/partner.service';

@Component({
  selector: 'app-return-location',
  templateUrl: './return-location.component.html',
  styleUrls: ['./return-location.component.scss'],
})
export class ReturnLocationComponent implements OnInit {
  isLoading: boolean = false;
  isSaving: boolean = false;
  returnLocationForm!: FormGroup;
  formFieldOnUI = {
    returnInternalCode: true,
    returnExternalCode: true,
    returnAddressLine1: true,
    returnAddressLine2: true,
    returnCity: true,
    returnState: true,
    returnZipCode: true,
    returnTimeZone: true,
    returnContactName: true,
    returnPhoneNumber: true,
    returnPhoneNumberExtension: true,
  };
  usStates = USStates;
  timeZone = TimeZone;
  formAction = FormAction;
  formTitle: string = this.formAction.EDIT;
  selectedData: any;
  disabledSection: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private formValidationService: FormValidationService,
    private router: Router,
    private partnerService: PartnerService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    // Initialize form
    this.returnLocationForm = this.formBuilder.group({
      formType: ['Edit'],
      returnInternalCode: [
        { value: '', disabled: true },
        [
          Validators.required,
          Validators.minLength(23),
          Validators.maxLength(23),
        ],
      ],
      returnExternalCode: [
        '',
        [Validators.required, Validators.maxLength(100)],
      ],
      returnAddressLine1: [
        '',
        [Validators.required, Validators.maxLength(255)],
      ],
      returnAddressLine2: ['', [Validators.maxLength(255)]],
      returnCity: ['', [Validators.required, Validators.maxLength(100)]],
      returnState: ['', [Validators.required]],
      returnZipCode: ['', [Validators.required, Validators.maxLength(10)]],
      returnTimeZone: ['', [Validators.required]],
      returnContactName: ['', [Validators.required, Validators.maxLength(30)]],
      returnPhoneNumber: ['', [Validators.required, Validators.minLength(12)]],
      returnPhoneNumberExtension: [
        '',
        [
          Validators.minLength(1),
          Validators.maxLength(5),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
    });

    // API calls
    this.getPartnersAndPatchForm();
  }

  getPartnersAndPatchForm() {
    this.isLoading = true;
    this.partnerService.getPartner().subscribe({
      next: (res: any) => {
        this.selectedData = res.payload.returnLocation;
        this.setValue(this.selectedData);
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
    return this.returnLocationForm.controls;
  }

  // Set Form Value
  changeFormType(event: string) {
    this.formTitle = event ? event : '';
    if (this.formTitle === 'Add') {
      this.setValue('');
      this.setInternalCode();
      this.disabledSection = false;
      this.formControl['returnCity'].enable();
      this.formControl['returnZipCode'].enable();
    } else {
      this.setValue(this.selectedData);
      this.disabledSection = true;
      this.formControl['returnCity'].disable();
      this.formControl['returnZipCode'].disable();
    }
  }

  setInternalCode() {
    // Assuming selectedData is an array, so wrap the single object in an array
    const partnerDataList = [this.selectedData]; // Modify this line to handle the single object

    console.log(partnerDataList);

    let maxInternalCode = partnerDataList?.reduce(function (
      max: any,
      current: any
    ) {
      return max?.returnInternalCode > current?.returnInternalCode
        ? max
        : current;
    });

    if (maxInternalCode) {
      const no = +maxInternalCode.returnInternalCode.split('-')[3];

      this.formControl['returnInternalCode'].setValue(
        maxInternalCode.returnInternalCode.slice(0, -3) +
          String(no + 1).padStart(3, '0')
      );
    } else {
      const selectedPartnerId = 'FRF-RETURN'; // Set this value based on your logic
      this.formControl['returnInternalCode'].setValue(
        `${selectedPartnerId}-LOCATION-001`
      );
    }
  }

  // Phone Input Field
  phoneInputField() {
    const returnPhoneNumberControl =
      this.returnLocationForm.get('returnPhoneNumber');
    let input = returnPhoneNumberControl?.value;
    let formattedInput = this.formValidationService.setUSFormate(input);

    // Limit the input to 12 characters including dashes
    formattedInput = formattedInput.substring(0, 12);
    returnPhoneNumberControl?.setValue(formattedInput);
  }

  // Reset Form
  reset() {
    const formType = this.formControl['formType'].value;
    this.returnLocationForm?.reset();
    this.formControl['formType'].setValue(formType);
    if (this.formTitle === 'Add') {
      this.disabledSection = false;
      this.formControl['returnCity'].enable();
      this.formControl['returnZipCode'].enable();
    } else {
      this.setValue(this.selectedData);
      this.disabledSection = true;
      this.formControl['returnCity'].disable();
      this.formControl['returnZipCode'].disable();
    }
  }

  // Set Form Value
  setValue(selectedData: any) {
    this.formControl['returnInternalCode'].setValue(
      selectedData?.returnInternalCode
    );
    this.formControl['returnExternalCode'].setValue(
      selectedData?.returnExternalCode
    );
    this.formControl['returnAddressLine1'].setValue(
      selectedData?.returnAddressLine1
    );
    this.formControl['returnAddressLine2'].setValue(
      selectedData?.returnAddressLine2
    );
    this.formControl['returnCity'].setValue(selectedData?.returnCity);
    if (this.formAction !== 'Add') {
      this.formControl['returnCity'].disable();
    } else {
      this.formControl['returnCity'].enable();
    }
    this.formControl['returnState'].setValue(selectedData?.returnState);
    this.formControl['returnZipCode'].setValue(selectedData?.returnZipCode);
    if (this.formAction !== 'Add') {
      this.formControl['returnZipCode'].disable();
    } else {
      this.formControl['returnZipCode'].enable();
    }
    this.formControl['returnTimeZone'].setValue(selectedData?.returnTimeZone);
    this.formControl['returnContactName'].setValue(
      selectedData?.returnContactName
    );
    this.formControl['returnPhoneNumber'].setValue(
      selectedData?.returnPhoneNumber
    );
    this.phoneInputField();
    this.formControl['returnPhoneNumberExtension'].setValue(
      selectedData?.returnPhoneNumberExtension
    );
  }

  // Submit Form
  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.returnLocationForm,
      this.formFieldOnUI
    );

    if (valid) {
      this.isSaving = true;
      const payload = {
        returnInternalCode: this.formFieldOnUI['returnInternalCode']
          ? this.formControl['returnInternalCode']?.value
          : '',
        returnExternalCode: this.formFieldOnUI['returnExternalCode']
          ? this.formControl['returnExternalCode']?.value
          : '',
        returnAddressLine1: this.formFieldOnUI['returnAddressLine1']
          ? this.formControl['returnAddressLine1']?.value
          : '',
        returnAddressLine2: this.formFieldOnUI['returnAddressLine2']
          ? this.formControl['returnAddressLine2']?.value
          : '',
        returnCity: this.formFieldOnUI['returnCity']
          ? this.formControl['returnCity']?.value
          : '',
        returnState: this.formFieldOnUI['returnState']
          ? this.formControl['returnState']?.value
          : '',
        returnZipCode: this.formFieldOnUI['returnZipCode']
          ? this.formControl['returnZipCode']?.value
          : '',
        returnTimeZone: this.formFieldOnUI['returnTimeZone']
          ? this.formControl['returnTimeZone']?.value
          : '',
        returnContactName: this.formFieldOnUI['returnContactName']
          ? this.formControl['returnContactName']?.value
          : '',
        returnPhoneNumber: this.formFieldOnUI['returnPhoneNumber']
          ? this.formControl['returnPhoneNumber']?.value?.split('-').join('')
          : '',
        returnPhoneNumberExtension: this.formFieldOnUI[
          'returnPhoneNumberExtension'
        ]
          ? this.formControl['returnPhoneNumberExtension']?.value
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
      Object.values(this.returnLocationForm.controls).forEach((control) => {
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
