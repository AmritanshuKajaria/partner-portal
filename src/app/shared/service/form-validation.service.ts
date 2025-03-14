import { Injectable } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  constructor() {}

  checkFormValidity(form: any, formObject: any) {
    let formValid = true;

    Object.entries(formObject).forEach(([key, isOnUI]) => {
      const control = form.get(key);

      if (isOnUI) {
        if (control instanceof FormControl) {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });

            if (formValid) {
              formValid = false; // Set to false if any control is invalid
            }
          }
        }
        if (control instanceof FormArray) {
          control.controls.forEach((formGroup: any) => {
            Object.values(formGroup.controls).forEach((arrayControl: any) => {
              if (arrayControl.invalid) {
                arrayControl.markAsDirty();
                arrayControl.updateValueAndValidity({ onlySelf: true });

                if (formValid) {
                  formValid = false; // Set to false if any control is invalid
                }
              }
            });
          });
        }
      }
    });

    return formValid;
  }

  setUSFormate(phoneNo: string) {
    // Remove all non-digit characters
    let formattedInput = '';
    if (phoneNo) {
      let input = phoneNo?.replace(/\D/g, '');

      // Format the input as 000-000-0000
      for (let i = 0; i < input.length; i++) {
        if (i === 3 || i === 6) {
          formattedInput += '-';
        }
        formattedInput += input[i];
      }
    }
    return formattedInput;
  }
}
