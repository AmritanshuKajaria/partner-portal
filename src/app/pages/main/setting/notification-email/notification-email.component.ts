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
import { Section } from 'src/app/shared/constants/constants';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';

@Component({
  selector: 'app-notification-email',
  templateUrl: './notification-email.component.html',
  styleUrls: ['./notification-email.component.scss'],
})
export class NotificationEmailComponent implements OnInit {
  section = Section;
  isLoading: boolean = false;
  shippingClosureList: any = [];
  newShippingClosureList: any = [
    {
      closureDate: '2024-08-30',
      remark: 'entity remark 1',
      isDeleted: 0,
    },
    {
      closureDate: '2024-08-31',
      remark: 'entity remark 1',
      isDeleted: 0,
    },
  ];
  oldShippingClosureList: any = [
    {
      closureDate: '2024-01-30',
      remark: 'entity remark 6',
      isDeleted: 0,
    },
    {
      closureDate: '2024-05-31',
      remark: 'entity remark 5',
      isDeleted: 0,
    },
  ];
  formTypes = new FormControl('notifications');
  showSection: string = this.section.TABLE;

  notificationEmailForm!: FormGroup;
  formFieldOnUI = {
    startDate: true,
    endDate: true,
    remark: true,
  };

  constructor(
    private formBuilder: FormBuilder,
    private formValidationService: FormValidationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.shippingClosureList = this.newShippingClosureList;
    this.notificationEmailForm = this.formBuilder.group({
      startDate: ['', [Validators?.required]],
      endDate: ['', [Validators?.required]],
      remark: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
    });
  }

  get formControl() {
    return this.notificationEmailForm.controls;
  }

  // Date formate
  changeDateFormat = (inputDate: string) => {
    return moment(inputDate, 'YYYY-MM-DD').format('dddd  - MMM DD, YYYY');
  };

  changeFormType(event: string) {
    if (event === 'notifications') {
      this.shippingClosureList = this.newShippingClosureList;
    } else {
      this.shippingClosureList = this.oldShippingClosureList;
    }
  }

  deleteAction(data: any) {}

  reset() {
    this.notificationEmailForm?.reset();
  }

  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.notificationEmailForm,
      this.formFieldOnUI
    );

    if (valid) {
      this.isLoading = true;
      let payload = this.notificationEmailForm.value;
      const addPayload = [];

      // Parse the dates
      const start: any = new Date(payload?.startDate);
      const end: any = new Date(payload?.endDate);

      // Calculate the difference in time
      const diffTime = end - start;

      // Calculate the difference in days
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      for (let index = 0; index < diffDays; index++) {
        addPayload.push({
          closureDate: moment(start).add(index, 'days').format('YYYY-MM-DD'),
          remark: payload.remark,
        });
      }
      payload = {
        newShippingClosures: addPayload,
        partnerCode: 'TDA',
      };
      setTimeout(() => {
        console.log(payload);
        this.isLoading = false;
        this.notificationEmailForm?.reset();
        this.showSection = this.section.TABLE;
      }, 500);
    } else {
      Object.values(this.notificationEmailForm.controls).forEach((control) => {
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
      this.notificationEmailForm?.reset();
    } else {
      this.router.navigate(['/main/setting']);
    }
  }
}
