import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import AppDateFormate from 'src/app/shared/pipes/custom-date.pipe';
import { OrdersService } from 'src/app/shared/service/orders.service';

@Component({
  selector: 'app-confirm-shipped',
  templateUrl: './confirm-shipped.component.html',
  styleUrls: ['./confirm-shipped.component.scss'],
})
export class ConfirmShippedComponent implements OnInit {
  @Input() poNo: string = '';
  @Output()
  close = new EventEmitter();

  isLoading: boolean = false;
  confirmShippedForm!: FormGroup;
  appDateFormate = AppDateFormate;

  constructor(
    private ordersService: OrdersService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.confirmShippedForm = this.fb.group({
      carrier: ['', [Validators.required]],
      shipping_date: ['', [Validators.required]],
      other_carrier: [''],
      trackingList: this.fb.array([]),
    });
    this.addTracking();
  }

  get trackingList(): FormArray {
    return this.confirmShippedForm.controls['trackingList'] as FormArray;
  }

  newTracking() {
    return this.fb.group({
      tracking: ['', [Validators.required]],
    });
  }

  addTracking() {
    this.trackingList.push(this.newTracking());
  }

  removeTracking(i: number) {
    this.trackingList.removeAt(i);
  }

  onCarrierChanged(event: string) {
    if (event === 'Others') {
      this.confirmShippedForm.controls['other_carrier'].setValidators([
        Validators.required,
      ]);
    } else {
      this.confirmShippedForm.controls['other_carrier'].clearValidators();
    }
    this.confirmShippedForm.controls['other_carrier'].updateValueAndValidity();
  }

  submit() {
    const data: any = {
      po_no: this.poNo,
      carrier:
        this.confirmShippedForm.controls['carrier'].value === 'Others'
          ? this.confirmShippedForm.controls['other_carrier'].value ?? ''
          : this.confirmShippedForm.controls['carrier'].value ?? '',
      shipping_date: this.confirmShippedForm.controls['shipping_date'].value
        ? moment(
            this.confirmShippedForm.controls['shipping_date'].value
          ).format('YYYY-MM-DD')
        : '',
      tracking_no: [],
    };
    let trackingList = this.confirmShippedForm.controls['trackingList'].value;
    trackingList.forEach((element: any) => {
      data['tracking_no'].push(element?.tracking);
    });
    this.ordersService.confirmShipped(data).subscribe((res: any) => {
      if (res.success) {
        this.handleCancel();
        this.message.success('Confirm shipping successfully!');
      }
    });
  }

  handleCancel() {
    this.close.emit();
  }
}
