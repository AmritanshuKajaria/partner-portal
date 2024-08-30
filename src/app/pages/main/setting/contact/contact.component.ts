import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  FormAction,
  Section,
  TimeZone,
} from 'src/app/shared/constants/constants';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  section = Section;
  formAction = FormAction;
  isLoading: boolean = false;
  labelList: any = {
    firstName: 'First Name',
    contactPhoneNumberExtension: 'Phone Extension',
    lastName: 'Last Name',
    contactPhoneNumber: 'Phone Number',
    contactTimeZone: 'Time Zone',
    arrRoles: 'Role',
    designation: 'Designation',
    extra: '',
  };
  contactList: any = [
    {
      contactId: '264',
      partnerId: '101',
      firstName: 'Customer Service Desk',
      lastName: 'wer43',
      designation: 'Customer Service',
      contactPhoneNumber: '9099441980',
      contactPhoneNumberExtension: '',
      contactTimeZone: 'PST',
      notes: '',
      arrRoles: [1, 3, 5],
      isDeleted: 0,
    },
    {
      contactId: '264',
      partnerId: '101',
      firstName: 'Customer Service Desk',
      lastName: 'wer43',
      designation: 'Customer Service',
      contactPhoneNumber: '9099441980',
      contactPhoneNumberExtension: '',
      contactTimeZone: 'PST',
      notes: '',
      arrRoles: [2, 4],
      isDeleted: 0,
    },
  ];
  dropDownList: any = null;
  timeZone = TimeZone;
  formTitle: string = this.formAction.ADD;
  showSection: string = this.section.TABLE;

  contactForm!: FormGroup;
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

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private formValidationService: FormValidationService,
    private modal: NzModalService
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

    this.contactForm = this.formBuilder.group({
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
    return this.contactForm.controls;
  }

  objectKeys(obj: any): any[] {
    return Object.entries(obj);
  }

  phoneInputField() {
    const contactPhoneNumberControl =
      this.contactForm.get('contactPhoneNumber');
    let input = contactPhoneNumberControl?.value;
    let formattedInput = this.formValidationService.setUSFormate(input);

    // Limit the input to 12 characters including dashes
    formattedInput = formattedInput.substring(0, 12);
    contactPhoneNumberControl?.setValue(formattedInput);
  }

  // Convert Id to label
  getRoleLabelList = (arrRoles: any) => {
    let matchingValues = [];
    if (arrRoles) {
      matchingValues = arrRoles.map((res: any) => {
        return this.dropDownList?.contactRoles.find(
          (role: any) => role.value == res
        )?.name;
      });
    }
    return matchingValues.join(', ');
  };

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

  deleteAction(data: any) {
    this.modal.confirm({
      nzTitle: 'Delete Contact',
      nzContent: 'Are you sure you want to remove the Manager Contact Details?',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          console.log(data);
        }).catch(() => console.log('Oops errors!')),
    });
  }

  reset() {
    if (this.formTitle === this.formAction?.ADD) {
      this.contactForm?.reset();
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
      this.contactForm,
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
        this.contactForm?.reset();
        this.showSection = this.section.TABLE;
      }, 500);
    } else {
      Object.values(this.contactForm.controls).forEach((control) => {
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
      this.contactForm?.reset();
    } else {
      window.history.back();
    }
  }
}
