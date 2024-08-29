import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FormAction,
  Section,
  TimeZone,
} from 'src/app/shared/constants/constants';
import { CommonService } from 'src/app/shared/service/common.service';

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
      arrRoles: ['1', '3', '5'],
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
      arrRoles: ['1', '5'],
      isDeleted: 0,
    },
  ];
  dropDownList: any = null;
  timeZone = TimeZone;
  formTitle: string = this.formAction.ADD;
  showSection: string = this.section.FORM;

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

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder
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
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      contactPhoneNumber: ['', [Validators.required]],
      contactPhoneNumberExtension: [''],
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
    console.log(data);
  }

  deleteAction(data: any) {
    console.log(data);
  }

  reset() {
    this.contactForm?.reset();
  }

  submitForm() {}

  goBack() {
    window.history.back();
  }
}
