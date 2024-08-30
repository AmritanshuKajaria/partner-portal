import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Section, TimeZone } from 'src/app/shared/constants/constants';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';

@Component({
  selector: 'app-shipping-closures',
  templateUrl: './shipping-closures.component.html',
  styleUrls: ['./shipping-closures.component.scss'],
})
export class ShippingClosuresComponent implements OnInit {
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
  formTypes = new FormControl('new');
  showSection: string = this.section.TABLE;

  shippingClosureForm!: FormGroup;
  formFieldOnUI = {
    startDate: true,
    endDate: true,
    remark: true,
  };

  constructor(
    private formBuilder: FormBuilder,
    private formValidationService: FormValidationService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.shippingClosureList = this.newShippingClosureList;
    this.shippingClosureForm = this.formBuilder.group({
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
    return this.shippingClosureForm.controls;
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.formControl['endDate']?.value) {
      return false;
    }
    return startValue.getTime() > this.formControl['endDate']?.value.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.formControl['startDate']?.value) {
      return false;
    }
    return endValue.getTime() <= this.formControl['startDate']?.value.getTime();
  };

  // Date formate
  changeDateFormat = (inputDate: string) => {
    return moment(inputDate, 'YYYY-MM-DD').format('dddd  - MMM DD, YYYY');
  };

  changeFormType(event: string) {
    console.log(event);
    if (event === 'new') {
      this.shippingClosureList = this.newShippingClosureList;
    } else {
      this.shippingClosureList = this.oldShippingClosureList;
    }
  }

  deleteAction(data: any) {
    this.modal.confirm({
      nzTitle: 'Delete Shipping Closure',
      nzContent:
        'Are you sure you want to remove the Manager Shipping Closure Details?',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          console.log(data);
        }).catch(() => console.log('Oops errors!')),
    });
  }

  reset() {
    this.shippingClosureForm?.reset();
  }

  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.shippingClosureForm,
      this.formFieldOnUI
    );

    if (valid) {
      this.isLoading = true;
      let payload = this.shippingClosureForm.value;
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
      window.history.back();
    }
  }
}
