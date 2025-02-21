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
import { NzMessageService } from 'ng-zorro-antd/message';
import { PartnerService } from 'src/app/shared/service/partner.service';
import { ApiResponse } from 'src/app/shared/model/common.model';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  section = Section;
  formAction = FormAction;
  isLoading: boolean = false;
  isSaving: boolean = false;
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
  labelListArray: any = [
    'firstName',
    'contactPhoneNumberExtension',
    'lastName',
    'contactPhoneNumber',
    'contactTimeZone',
    'arrRoles',
    'designation',
    'extra',
  ];
  contactList: any = [];
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
  contactId = '0';

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private formValidationService: FormValidationService,
    private modal: NzModalService,
    private router: Router,
    private partnerService: PartnerService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

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
      next: (result: ApiResponse) => {
        if (result.success) {
          const res: any = result?.response ?? {};
          if (res.contacts && res.contacts.length > 0) {
            this.contactList = res.contacts.map((x: any) => ({
              ...x,
              mappedLabelRoles: this.getRoleLabelList(x.arrRoles),
            }));
          }
        } else {
          this.message.error(result?.msg ? result?.msg : 'Get partner failed!');
        }
        this.isLoading = false;
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Get partner failed!');
        }
        this.isLoading = false;
      },
    });
  }

  get formControl() {
    return this.contactForm.controls;
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
        return this.dropDownList?.arrRoles.find(
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
    this.formControl['arrRoles'].setValue(
      data?.arrRoles?.map((role: any) => +role) // Convert each element to a number using +
    );
    this.contactId = data.contactId;
  }

  deleteAction(data: any) {
    let payload = {
      contactId: data.contactId,
      isDeleted: 1,
    };

    this.modal.confirm({
      nzTitle: 'Delete Contact',
      nzContent: 'Are you sure you want to remove the Manager Contact Details?',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.partnerService.updatePartner(payload).subscribe({
            next: (result: ApiResponse) => {
              resolve(result);
              this.message.create('success', 'Data Updated Successfully!');
              // Fetch the updated partner data after a successful update
              this.getPartnersAndPatchForm();
            },
            error: (error: any) => {
              reject(error);
            },
          });
        }).catch((error) => {
          console.log(error);
          this.message.create('error', error?.msg || 'Date Update Failed!'),
            (this.isLoading = false);
        }),
    });
  }

  reset() {
    if (this.formTitle === this.formAction?.ADD) {
      this.contactForm?.reset();
      this.contactId = '0';
    } else {
      this.formControl['firstName'].setValue(this.selectedContact?.firstName);
      this.formControl['lastName'].setValue(this.selectedContact?.lastName);
      this.formControl['designation'].setValue(
        this.selectedContact?.designation
      );
      this.formControl['contactPhoneNumber'].setValue(
        this.selectedContact?.contactPhoneNumber
      );
      this.phoneInputField();
      this.formControl['contactPhoneNumberExtension'].setValue(
        this.selectedContact?.contactPhoneNumberExtension
      );
      this.formControl['contactTimeZone'].setValue(
        this.selectedContact?.contactTimeZone
      );
      this.formControl['arrRoles'].setValue(
        this.selectedContact?.arrRoles?.map((role: any) => +role) // Convert each element to a number using +
      );
    }
  }

  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.contactForm,
      this.formFieldOnUI
    );

    if (valid) {
      this.isSaving = true;
      const payload = {
        contactId: this.contactId,
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

      this.partnerService.updatePartner(payload).subscribe({
        next: (result: ApiResponse) => {
          if (result.success) {
            this.message.create('success', 'Data Updated Successfully!');
            this.isSaving = false;
            this.contactId = '0';
            this.contactForm?.reset();
            this.showSection = this.section.TABLE;

            // Fetch the updated partner data after a successful update
            this.getPartnersAndPatchForm();
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Date Update Failed!'
            );
          }
        },
        error: (err: any) => {
          if (!err?.error_shown) {
            this.message.error('Date Update Failed!');
          }
          // this.isSaving = false; // Ensure saving state is updated on error
        },
      });
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
      this.contactId = '0';
    } else {
      this.router.navigate(['/main/setting']);
    }
  }
}
