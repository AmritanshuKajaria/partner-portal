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
  shippingClosureList: any = [];
  newShippingClosureList: any 
  oldShippingClosureList: any 
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

    this.partnerService.getPartner().subscribe({
      next: (res: any) => {
        console.log(res);
        this.shippingClosureList = res.payload.upcomingShippingClosures;
        this.newShippingClosureList = res.payload.upcomingShippingClosures;
        this.oldShippingClosureList = res.payload.previousShippingClosures;
        this.isLoading = false;
      },
      error: (error) => {
        this.message.create(
          'error',
          error?.error_message?.[0] ||
            'Something went wrong fetching the data'
        );
        this.isLoading = false;
      },
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

        this.partnerService.updatePartner(data).subscribe({
          next: (res: any) => {
            console.log(data)
            this.isLoading = true;
            this.message.create('success', 'Data Deleted Successfully!');
            this.partnerService.getPartner().subscribe({
              next: (res: any) => {
                this.shippingClosureForm?.reset();
                this.showSection = this.section.TABLE;
                this.shippingClosureList = res.payload.upcomingShippingClosures;
                this.newShippingClosureList = res.payload.upcomingShippingClosures;
                this.oldShippingClosureList = res.payload.previousShippingClosures;
                this.isLoading = false;
              },
              error: (error) => {
                this.message.create(
                  'error',
                  error?.error_message?.[0] ||
                    'Something went wrong fetching the data'
                );
                this.isLoading = false;
              },
            });
          },
          error: (error) => {
            this.message.create(
              'error',
              error?.error_message?.[0] ||
                'Something went wrong fetching the data'
            );
          },
        })
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
        console.log('payload::', payload);

        this.partnerService.updatePartner(payload).subscribe({
          next: (res) => {
            this.message.create('success', 'Data Updated Successfully!');
           
            // Fetch the updated partner data after a successful update
            this.partnerService.getPartner().subscribe({
              next: (res: any) => {
                this.shippingClosureForm?.reset();
                this.showSection = this.section.TABLE;
                this.shippingClosureList = res.payload.upcomingShippingClosures;
                this.newShippingClosureList = res.payload.upcomingShippingClosures;
                this.oldShippingClosureList = res.payload.previousShippingClosures;
                this.isLoading = false;
              },
              error: (error) => {
                this.message.create(
                  'error',
                  error?.error_message?.[0] ||
                    'Something went wrong fetching the data'
                );
                this.isLoading = false;
              },
            });
          },
          error: (error: any) => {
            this.message.create(
              'error',
              error?.error_message?.[0] || 'Data Update failed!'
            );
            this.isLoading = false; // Ensure saving state is updated on error
          },
        });
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
