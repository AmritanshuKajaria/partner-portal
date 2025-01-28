import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  @Output() close = new EventEmitter();
  @Input() poNo = '';

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
    this.isLoading = true;
    const data = {
      po_no: this.poNo,
      carrier: this.confirmShippedForm.value.carrier,
      shipping_date: moment(this.confirmShippedForm.value.shipping_date).format(
        'YYYY-MM-DD'
      ),
      tracking_list: this.confirmShippedForm.value.trackingList.map(
        (tracking: any) => tracking.tracking
      ),
    };
    this.ordersService.markOrderShipped(data).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.message.success('Mark shipped successfully!');
          this.handleCancel();
        } else {
          this.message.error(res?.error_message ?? 'Mark shipped failed!');
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        if (!error?.error_shown) {
          this.message.error('Mark shipped failed!');
        }
        this.isLoading = false;
      },
    });
  }

  handleCancel() {
    this.close.emit();
  }
}
