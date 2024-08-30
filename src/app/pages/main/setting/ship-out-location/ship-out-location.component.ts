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

@Component({
  selector: 'app-ship-out-location',
  templateUrl: './ship-out-location.component.html',
  styleUrls: ['./ship-out-location.component.scss'],
})
export class ShipOutLocationComponent implements OnInit {
  section = Section;
  formAction = FormAction;
  isLoading: boolean = false;
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
  activateList = [
    {
      internalCode: 'FDC-LOC-002',
      externalCode: 'CA-91730',
      addressLine1: '4D Concepts,',
      addressLine2: '9120 Center Avenue Rancho Cucamonga',
      city: 'Rancho Cucamonga',
      state: 'CA',
      zipCode: '91730',
      country: 'US',
      timeZone: 'PST',
      cutOffTime: '06:00:00',
      contactName: 'Jeff Riegsecker',
      phoneNumber: '9099441980',
      phoneNumberExtension: '',
      isActive: '1',
    },
    {
      internalCode: 'FDC-LOC-003',
      externalCode: '4DC Salley',
      addressLine1: '5244 Festival Trail Road',
      addressLine2: '',
      city: 'Salley',
      state: 'SC',
      zipCode: '29137',
      country: 'US',
      timeZone: 'EST',
      cutOffTime: '16:00:00',
      contactName: 'Charles Edgeman',
      phoneNumber: '9099441980',
      phoneNumberExtension: '33',
      isActive: '1',
    },
  ];
  deactivateList = [
    {
      internalCode: 'FDC-LOC-001',
      externalCode: 'CA-91730',
      addressLine1: '11699 6TH Street',
      addressLine2: '',
      city: 'Rancho Cucamonga',
      state: 'CA',
      zipCode: '91730',
      country: 'US',
      timeZone: 'PST',
      cutOffTime: '18:00:00',
      contactName: 'Jeff Riegsecker',
      phoneNumber: '9099441980',
      phoneNumberExtension: '',
      isActive: '0',
    },
  ];
  usStates = USStates;
  timeZone = TimeZone;
  formTitle: string = this.formAction.ADD;
  showSection: string = this.section.TABLE;

  shippingClosureForm!: FormGroup;
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.shipOutLocationList = this.activateList;

    this.shippingClosureForm = this.formBuilder.group({
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
  }

  get formControl() {
    return this.shippingClosureForm.controls;
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

  phoneInputField() {
    const phoneNumberControl = this.shippingClosureForm.get('phoneNumber');
    let input = phoneNumberControl?.value;
    let formattedInput = this.formValidationService.setUSFormate(input);

    // Limit the input to 12 characters including dashes
    formattedInput = formattedInput.substring(0, 12);
    phoneNumberControl?.setValue(formattedInput);
  }

  addAction() {
    this.showSection = this.section.FORM;
    this.formTitle = this.formAction.ADD;
    this.shippingClosureForm.reset();
    this.setInternalCode();
  }

  editAction(data: any) {
    this.showSection = this.section.FORM;
    this.formTitle = this.formAction.EDIT;
    this.selectedShipOutLocation = data;
    this.patchFormValue(this.selectedShipOutLocation);
  }

  changeStatus(data: any) {
    this.modal.confirm({
      nzTitle: data?.isActive === '1' ? 'Deactivate' : 'Activate',
      nzContent: `Are you sure you want to ${
        data?.isActive === '1' ? 'Deactivate' : 'Activate'
      } this Ship-Out Location?`,
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          console.log(data);
        }).catch(() => console.log('Oops errors!')),
    });
  }

  reset() {
    if (this.formTitle === this.formAction?.ADD) {
      this.shippingClosureForm?.reset();
      this.setInternalCode();
    } else {
      this.patchFormValue(this.selectedShipOutLocation);
    }
  }

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

  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.shippingClosureForm,
      this.formFieldOnUI
    );

    if (valid) {
      this.isLoading = true;
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
          ? this.formControl['phoneNumber']?.value
          : '',
        phoneNumberExtension: this.formFieldOnUI['phoneNumberExtension']
          ? this.formControl['phoneNumberExtension']?.value
          : '',
      };
      setTimeout(() => {
        console.log(payload);
        this.isLoading = false;
        this.shippingClosureForm?.reset();
        this.showSection = this.section.TABLE;
      }, 500);
    } else {
      Object.values(this.shippingClosureForm.controls).forEach((control) => {
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
    let maxInternalCode = partnerDataList?.reduce(function (max, current) {
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

  goBack() {
    if (this.showSection !== this.section.TABLE) {
      this.showSection = this.section.TABLE;
      this.shippingClosureForm?.reset();
    } else {
      this.router.navigate(['/main/setting']);
    }
  }
}
