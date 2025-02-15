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
import { Section, TimeZone } from 'src/app/shared/constants/constants';
import { CommonService } from 'src/app/shared/service/common.service';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PartnerService } from 'src/app/shared/service/partner.service';

@Component({
  selector: 'app-shipping-closures',
  templateUrl: './shipping-closures.component.html',
  styleUrls: ['./shipping-closures.component.scss'],
})
export class ShippingClosuresComponent implements OnInit {
  section = Section;
  isLoading: boolean = false;
  isSaving: boolean = false;
  shippingClosureList: any = [];
  newShippingClosureList: any = [];
  oldShippingClosureList: any = [];
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
    private modal: NzModalService,
    private router: Router,
    private partnerService: PartnerService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    // Initialize form
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

    // Get API call
    this.getPartnersData();
  }

  getPartnersData() {
    this.isLoading = true;
    this.partnerService.getPartner().subscribe({
      next: (res: any) => {
        this.shippingClosureList = res.payload.upcomingShippingClosures;
        this.newShippingClosureList = res.payload.upcomingShippingClosures;
        this.oldShippingClosureList = res.payload.previousShippingClosures;
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
    return this.shippingClosureForm.controls;
  }

  // Disable start Date
  disabledStartDate = (startValue: Date): boolean => {
    const currentDate = moment(new Date()).startOf('day');
    const startDate = moment(startValue).startOf('day');
    const selectedEndDate = this.formControl['endDate']
      ? moment(this.formControl['endDate'].value).startOf('day')
      : false;
    return (
      // This is to disable dates before current date
      currentDate.isAfter(startDate) ||
      // This is to disable dates after selected end date
      (selectedEndDate && startDate.isAfter(selectedEndDate))
    );
  };

  // Disable end Date
  disabledEndDate = (endValue: Date): boolean => {
    const currentDate = moment(new Date()).startOf('day');
    const endDate = moment(endValue).startOf('day');
    const selectedStartDate = this.formControl['startDate']
      ? moment(this.formControl['startDate'].value).startOf('day')
      : false;
    return (
      // This is to disable dates before current date
      currentDate.isAfter(endDate) ||
      // This is to disable dates till selected start date
      (selectedStartDate && endDate.isBefore(selectedStartDate))
    );
  };

  // Date formate
  changeDateFormat = (inputDate: string) => {
    return moment(inputDate, 'YYYY-MM-DD').format('dddd  - MMM DD, YYYY');
  };

  // Change Form Type list
  changeFormType(event: string) {
    if (event === 'new') {
      this.shippingClosureList = this.newShippingClosureList;
    } else {
      this.shippingClosureList = this.oldShippingClosureList;
    }
  }

  // Delete Shipping Closure
  deleteAction(data: any) {
    this.modal.confirm({
      nzTitle: 'Delete Shipping Closure',
      nzContent:
        'Are you sure you want to remove the Shipping Closure Details?',

      nzOnOk: () =>
        new Promise((resolve, reject) => {
          // added is Deleted 1 to delete
          const payload = {
            ...data,
            isDeleted: 1,
          };
          this.partnerService.updatePartner(payload).subscribe({
            next: (res: any) => {
              resolve(res);
              this.message.create('success', 'Data Deleted Successfully!');
              this.getPartnersData();
            },
            error: (error) => {
              reject(error);
            },
          });
        }).catch((error) => {
          this.message.create(
            'error',
            error?.error_message?.[0] || 'Date Update Failed!'
          ),
            (this.isLoading = false);
        }),
    });
  }

  // Reset form
  reset() {
    this.shippingClosureForm?.reset();
  }

  // Submit form
  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.shippingClosureForm,
      this.formFieldOnUI
    );

    if (valid) {
      this.isSaving = true;
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
      };

      this.partnerService.updatePartner(payload).subscribe({
        next: (res) => {
          this.message.create('success', 'Data Updated Successfully!');
          this.formTypes.setValue('new');
          this.showSection = this.section.TABLE;
          this.isSaving = false;
          // Fetch the updated partner data after a successful update
          this.getPartnersData();
        },
        error: (error: any) => {
          this.message.create(
            'error',
            error?.error_message?.[0] || 'Date Update Failed!'
          );
          this.isSaving = false; // Ensure saving state is updated on error
        },
      });
    }
  }

  // Navigate back
  goBack() {
    if (this.showSection !== this.section.TABLE) {
      this.showSection = this.section.TABLE;
      this.shippingClosureForm?.reset();
    } else {
      this.router.navigate(['/main/setting']);
    }
  }
}
