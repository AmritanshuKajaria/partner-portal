import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  FormAction,
  Section,
  TimeZone,
} from 'src/app/shared/constants/constants';
import { CommonService } from 'src/app/shared/service/common.service';
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
  dropDownList: any = null;
  timeZone = TimeZone;
  formTitle: string = this.formAction.ADD;
  showSection: string = this.section.TABLE;

  shippingClosureForm!: FormGroup;
  formFieldOnUI = {
    firstName: true,
    lastName: true,
    designation: true,
    contactPhoneNumber: true,
    contactPhoneNumberExtension: true,
    contactTimeZone: true,
    arrRoles: true,
  };
  selectedContact: any = null;
  formTypes = new FormControl('active');

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private formValidationService: FormValidationService,
    private modal: NzModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.shipOutLocationList = this.activateList;
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

    this.shippingClosureForm = this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
        ],
      ],
      designation: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
        ],
      ],
      contactPhoneNumber: ['', [Validators.required, Validators.minLength(12)]],
      contactPhoneNumberExtension: [
        '',
        [
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(1),
          Validators.maxLength(5),
        ],
      ],
      contactTimeZone: ['', [Validators.required]],
      arrRoles: [[], [Validators.required]],
    });
  }

  get formControl() {
    return this.shippingClosureForm.controls;
  }

  changeFormType(event: string) {
    console.log(event);
    if (event === 'active') {
      this.shipOutLocationList = this.activateList;
    } else {
      this.shipOutLocationList = this.deactivateList;
    }
  }

  objectKeys(obj: any): any[] {
    return Object.entries(obj);
  }

  phoneInputField() {
    const contactPhoneNumberControl =
      this.shippingClosureForm.get('contactPhoneNumber');
    let input = contactPhoneNumberControl?.value;
    let formattedInput = this.formValidationService.setUSFormate(input);

    // Limit the input to 12 characters including dashes
    formattedInput = formattedInput.substring(0, 12);
    contactPhoneNumberControl?.setValue(formattedInput);
  }

  editAction(data: any) {
    this.showSection = this.section.FORM;
    this.formTitle = this.formAction.EDIT;
    this.selectedContact = data;
    this.formControl['firstName'].setValue(data?.firstName);
    this.formControl['lastName'].setValue(data?.lastName);
    this.formControl['designation'].setValue(data?.designation);
    this.formControl['contactPhoneNumber'].setValue(data?.contactPhoneNumber);
    this.phoneInputField();
    this.formControl['contactPhoneNumberExtension'].setValue(
      data?.contactPhoneNumberExtension
    );
    this.formControl['contactTimeZone'].setValue(data?.contactTimeZone);
    this.formControl['arrRoles'].setValue(data?.arrRoles);
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
    } else {
      this.formControl['firstName'].setValue(this.selectedContact?.firstName);
      this.formControl['lastName'].setValue(this.selectedContact?.lastName);
      this.formControl['designation'].setValue(
        this.selectedContact?.designation
      );
      this.formControl['contactPhoneNumber'].setValue(
        this.selectedContact?.contactPhoneNumber
      );
      this.formControl['contactPhoneNumberExtension'].setValue(
        this.selectedContact?.contactPhoneNumberExtension
      );
      this.formControl['contactTimeZone'].setValue(
        this.selectedContact?.contactTimeZone
      );
      this.formControl['arrRoles'].setValue(this.selectedContact?.arrRoles);
    }
  }

  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.shippingClosureForm,
      this.formFieldOnUI
    );

    if (valid) {
      this.isLoading = true;
      const payload = {
        firstName: this.formFieldOnUI['firstName']
          ? this.formControl['firstName']?.value
          : '',
        lastName: this.formFieldOnUI['lastName']
          ? this.formControl['lastName']?.value
          : '',
        designation: this.formFieldOnUI['designation']
          ? this.formControl['designation']?.value
          : '',
        contactPhoneNumber: this.formFieldOnUI['contactPhoneNumber']
          ? this.formControl['contactPhoneNumber']?.value?.split('-').join('')
          : '',
        contactPhoneNumberExtension: this.formFieldOnUI[
          'contactPhoneNumberExtension'
        ]
          ? this.formControl['contactPhoneNumberExtension']?.value
          : '',
        contactTimeZone: this.formFieldOnUI['contactTimeZone']
          ? this.formControl['contactTimeZone']?.value
          : '',
        arrRoles: this.formFieldOnUI['arrRoles']
          ? this.formControl['arrRoles']?.value
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

  goBack() {
    if (this.showSection !== this.section.TABLE) {
      this.showSection = this.section.TABLE;
      this.shippingClosureForm?.reset();
    } else {
      this.router.navigate(['/main/setting']);
    }
  }
}
