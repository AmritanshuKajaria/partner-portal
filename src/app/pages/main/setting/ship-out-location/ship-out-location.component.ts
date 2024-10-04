import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  FormAction,
  Section,
  TimeZone,
  USStates,
} from 'src/app/shared/constants/constants';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PartnerService } from 'src/app/shared/service/partner.service';

@Component({
  selector: 'app-ship-out-location',
  templateUrl: './ship-out-location.component.html',
  styleUrls: ['./ship-out-location.component.scss'],
})
export class ShipOutLocationComponent implements OnInit {
  section = Section;
  formAction = FormAction;
  isLoading: boolean = false;
  isSaving: boolean = false;
  labelList: any = {
    internalCode: 'Internal Code',
    zipCode: 'Zip Code',
    externalCode: 'External Code',
    timeZone: 'Time Zone',
    addressLine1: 'Address Line1',
    cutOffTime: 'Cut Off Time',
    addressLine2: 'Address Line2',
    contactName: 'Contact Name',
    city: 'City',
    phoneNumber: 'Phone Number',
    state: 'State',
    phoneNumberExtension: 'Phone Extension',
  };

  shipOutLocationList: any = [];
  activateList: any = [];
  deactivateList: any = [];
  usStates = USStates;
  timeZone = TimeZone;
  formTitle: string = this.formAction.ADD;
  showSection: string = this.section.TABLE;

  shipOutLocationForm!: FormGroup;
  formFieldOnUI = {
    internalCode: true,
    externalCode: true,
    addressLine1: true,
    addressLine2: true,
    city: true,
    state: true,
    zipCode: true,
    country: true,
    timeZone: true,
    cutOffTime: true,
    contactName: true,
    phoneNumber: true,
    phoneNumberExtension: true,
  };
  selectedShipOutLocation: any = null;
  formTypes = new FormControl('active');

  constructor(
    private formBuilder: FormBuilder,
    private formValidationService: FormValidationService,
    private modal: NzModalService,
    private router: Router,
    private partnerService: PartnerService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.shipOutLocationForm = this.formBuilder.group({
      internalCode: [
        { value: 'FDC-LOC-001', disabled: true },
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      externalCode: ['', [Validators.required, Validators.maxLength(100)]],
      addressLine1: ['', [Validators.required, Validators.maxLength(255)]],
      addressLine2: ['', [Validators.maxLength(255)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.maxLength(10)]],
      country: ['', [Validators.required]],
      timeZone: ['', [Validators.required]],
      cutOffTime: ['', [Validators.required]],
      contactName: ['', [Validators.required, Validators.maxLength(30)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(12)]],
      phoneNumberExtension: [
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
        console.log(res);
        this.shipOutLocationForm?.reset();
        this.shipOutLocationList = res.payload.shipoutLocations;
        this.activateList = res.payload.shipoutLocations;
        this.deactivateList = res.payload.shipoutLocationsInactive;
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
    return this.shipOutLocationForm.controls;
  }

  changeFormType(event: string) {
    if (event === 'active') {
      this.shipOutLocationList = this.activateList;
    } else {
      this.shipOutLocationList = this.deactivateList;
    }
  }

  objectKeys(obj: any): any[] {
    return Object.entries(obj);
  }

  changeState() {
    this.formControl['country'].setValue('US');
  }

  // Patch Form Value
  phoneInputField() {
    const phoneNumberControl = this.shipOutLocationForm.get('phoneNumber');
    let input = phoneNumberControl?.value;
    let formattedInput = this.formValidationService.setUSFormate(input);

    // Limit the input to 12 characters including dashes
    formattedInput = formattedInput.substring(0, 12);
    phoneNumberControl?.setValue(formattedInput);
  }

  addAction() {
    this.showSection = this.section.FORM;
    this.formTitle = this.formAction.ADD;
    this.shipOutLocationForm.reset();
    this.setInternalCode();
  }

  editAction(data: any) {
    this.showSection = this.section.FORM;
    this.formTitle = this.formAction.EDIT;
    this.selectedShipOutLocation = data;
    this.patchFormValue(this.selectedShipOutLocation);
  }

  // Change Status Activate / Deactivate
  changeStatus(data: any) {
    let isActive = data?.isActive === '1' ? '0' : '1';
    let payload = { ...data }; // Create a shallow copy of data
    payload['isActive'] = isActive;

    this.modal.confirm({
      nzTitle: data?.isActive === '1' ? 'Deactivate' : 'Activate',
      nzContent: `Are you sure you want to ${
        data?.isActive === '1' ? 'Deactivate' : 'Activate'
      } this Ship-Out Location?`,
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.partnerService.updatePartner(payload).subscribe({
            next: (res) => {
              resolve(res);
              this.message.create('success', 'Data Updated Successfully!');
              this.isLoading = true;
              this.formTypes.setValue('active');
              // Fetch the updated partner data after a successful update
              this.getPartnersAndPatchForm();
            },
            error: (error: any) => {
              reject(error);
            },
          });
        }).catch((error) => {
          console.log(error);

          this.message.create(
            'error',
            error?.error_message?.[0] || 'Data Update failed!'
          ),
            (this.isLoading = false);
        }),
    });
  }

  // Reset Form
  reset() {
    if (this.formTitle === this.formAction?.ADD) {
      this.shipOutLocationForm?.reset();
      this.setInternalCode();
    } else {
      this.patchFormValue(this.selectedShipOutLocation);
    }
  }

  // Patch Form Value
  patchFormValue(data: any) {
    this.formControl['internalCode'].setValue(data?.internalCode);
    this.formControl['externalCode'].setValue(data?.externalCode);
    this.formControl['addressLine1'].setValue(data?.addressLine1);
    this.formControl['addressLine2'].setValue(data?.addressLine2);
    this.formControl['city'].setValue(data?.city);
    this.formControl['state'].setValue(data?.state);
    this.formControl['zipCode'].setValue(data?.zipCode);
    this.formControl['country'].setValue(data?.country);
    this.formControl['timeZone'].setValue(data?.timeZone);
    if (data?.cutOffTime) {
      const timeString = data?.cutOffTime;
      // Split the time string into hours, minutes, and seconds
      const [hours, minutes, seconds] = timeString.split(':').map(Number);
      const cutOffTime = new Date();
      cutOffTime.setHours(hours, minutes, seconds);

      // Update the form control value
      this.formControl['cutOffTime'].setValue(cutOffTime);
    }
    this.formControl['contactName'].setValue(data?.contactName);
    this.formControl['phoneNumber'].setValue(data?.phoneNumber);
    this.phoneInputField();
    this.formControl['phoneNumberExtension'].setValue(
      data?.phoneNumberExtension
    );
  }

  // Submit Form
  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.shipOutLocationForm,
      this.formFieldOnUI
    );

    if (valid) {
      this.isSaving = true;
      const payload = {
        internalCode: this.formFieldOnUI['internalCode']
          ? this.formControl['internalCode']?.value
          : '',
        externalCode: this.formFieldOnUI['externalCode']
          ? this.formControl['externalCode']?.value
          : '',
        addressLine1: this.formFieldOnUI['addressLine1']
          ? this.formControl['addressLine1']?.value
          : '',
        addressLine2: this.formFieldOnUI['addressLine2']
          ? this.formControl['addressLine2']?.value
          : '',
        city: this.formFieldOnUI['city'] ? this.formControl['city']?.value : '',
        state: this.formFieldOnUI['state']
          ? this.formControl['state']?.value
          : '',
        zipCode: this.formFieldOnUI['zipCode']
          ? this.formControl['zipCode']?.value
          : '',
        country: this.formFieldOnUI['country']
          ? this.formControl['country']?.value
          : '',
        timeZone: this.formFieldOnUI['timeZone']
          ? this.formControl['timeZone']?.value
          : '',
        cutOffTime: this.formFieldOnUI['cutOffTime']
          ? this.formControl['cutOffTime']?.value
            ? moment(this.formControl['cutOffTime']?.value).format('HH:mm:ss')
            : ''
          : '',
        contactName: this.formFieldOnUI['contactName']
          ? this.formControl['contactName']?.value
          : '',
        phoneNumber: this.formFieldOnUI['phoneNumber']
          ? this.formControl['phoneNumber']
            ? this.formControl['phoneNumber']?.value.split('-').join('')
            : ''
          : '',
        phoneNumberExtension: this.formFieldOnUI['phoneNumberExtension']
          ? this.formControl['phoneNumberExtension']?.value
          : '',
        isActive: '1',
      };

      this.partnerService.updatePartner(payload).subscribe({
        next: (res) => {
          this.message.create('success', 'Data Updated Successfully!');
          this.formTypes.setValue('active');
          this.showSection = this.section.TABLE;
          this.isSaving = false;

          // Fetch the updated partner data after a successful update
          this.getPartnersAndPatchForm();
        },
        error: (error: any) => {
          this.message.create(
            'error',
            error?.error_message?.[0] || 'Data Update failed!'
          );
          this.isSaving = false; // Ensure saving state is updated on error
        },
      });
    } else {
      Object.values(this.shipOutLocationForm.controls).forEach((control) => {
        if (control.invalid) {
          if (control instanceof FormControl) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        }
      });
    }
  }

  setInternalCode() {
    const partnerDataList = this.activateList.concat(this.deactivateList);
    let maxInternalCode = partnerDataList?.reduce(function (
      max: any,
      current: any
    ) {
      return max?.internalCode > current?.internalCode ? max : current;
    });
    if (maxInternalCode) {
      const no = +maxInternalCode.internalCode.split('-')[2];
      this.formControl['internalCode'].setValue(
        maxInternalCode.internalCode.slice(0, -3) +
          String(no + 1).padStart(3, '0')
      );
    } else {
      const selectedPartnerId = 'TDS';
      this.formControl['internalCode'].setValue(`${selectedPartnerId}-LOC-001`);
    }
  }

  // Navigate back
  goBack() {
    if (this.showSection !== this.section.TABLE) {
      this.showSection = this.section.TABLE;
      this.shipOutLocationForm?.reset();
    } else {
      this.router.navigate(['/main/setting']);
    }
  }
}
