import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  FormAction,
  TimeZone,
  USStates,
} from 'src/app/shared/constants/constants';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';

@Component({
  selector: 'app-return-location',
  templateUrl: './return-location.component.html',
  styleUrls: ['./return-location.component.scss'],
})
export class ReturnLocationComponent implements OnInit {
  isLoading: boolean = false;
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
  selectedData = {
    returnInternalCode: 'TAC-RETURN-LOCATION-001',
    returnExternalCode: 'NV-89434-6531',
    returnAddressLine1: '100 Ireland Dr',
    returnAddressLine2: '',
    returnCity: 'Sparks',
    returnState: 'NV',
    returnZipCode: '89434',
    returnCountry: 'US',
    returnTimeZone: 'PST',
    returnContactName: 'Tachikara',
    returnPhoneNumber: '9134981881',
    returnPhoneNumberExtension: '',
  };
  disabledSection: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private formValidationService: FormValidationService
  ) {}

  ngOnInit(): void {
    this.returnLocationForm = this.formBuilder.group({
      formType: ['Edit'],
      returnInternalCode: [
        { value: 'FDC-RETURN-LOCATION-001', disabled: true },
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
    this.setValue(this.selectedData);
  }

  get formControl() {
    return this.returnLocationForm.controls;
  }

  changeFormType(event: string) {
    this.formTitle = event ? event : '';
    if (this.formTitle === 'Add') {
      this.setValue('');
      this.formControl['returnInternalCode'].setValue(
        `${'BYD'}-RETURN-LOCATION-001`
      );
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

  phoneInputField() {
    const returnPhoneNumberControl =
      this.returnLocationForm.get('returnPhoneNumber');
    let input = returnPhoneNumberControl?.value;
    let formattedInput = this.formValidationService.setUSFormate(input);

    // Limit the input to 12 characters including dashes
    formattedInput = formattedInput.substring(0, 12);
    returnPhoneNumberControl?.setValue(formattedInput);
  }

  reset() {
    const formType = this.formControl['formType'].value;
    this.returnLocationForm?.reset();
    this.formControl['formType'].setValue(formType);
    if (this.formTitle === 'Add') {
      this.formControl['returnInternalCode'].setValue(
        `${'BYD'}-RETURN-LOCATION-001`
      );
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

  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.returnLocationForm,
      this.formFieldOnUI
    );

    if (valid) {
      this.isLoading = true;
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
      setTimeout(() => {
        console.log(payload);
        this.isLoading = false;
        // this.returnLocationForm?.reset();
        this.formControl['returnInternalCode'].setValue(
          `FDC-RETURN-LOCATION-001`
        );
      }, 500);
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

  goBack() {
    window.history.back();
  }
}
