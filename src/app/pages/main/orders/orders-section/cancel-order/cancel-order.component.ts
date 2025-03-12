import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { resText } from 'src/app/shared/constants/constants';
import { ApiResponse } from 'src/app/shared/model/common.model';
import { CancelOrders } from 'src/app/shared/model/orders.model';
import { OrdersService } from 'src/app/shared/service/orders.service';

@Component({
  selector: 'app-cancel-order',
  templateUrl: './cancel-order.component.html',
  styleUrls: ['./cancel-order.component.scss'],
})
export class CancelOrderComponent implements OnInit {
  @Input() poNo: string = '';
  @Output() closeModel = new EventEmitter();

  cancelOrderForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private ordersService: OrdersService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.cancelOrderForm = new FormGroup({
      option: new FormControl('', [Validators.required]),
      otherOption: new FormControl(''),
    });
  }

  selectReason(event: string) {
    if (event === '99 - Others') {
      this.cancelOrderForm.controls['otherOption'].setValidators([
        Validators.required,
      ]);
      this.cancelOrderForm.controls['otherOption'].updateValueAndValidity();
    } else {
      this.cancelOrderForm.controls['otherOption'].clearValidators();
      this.cancelOrderForm.controls['otherOption'].updateValueAndValidity();
    }
  }

  submit() {
    this.isLoading = true;
    const data: CancelOrders = {
      po_no: this.poNo,
      reason: this.cancelOrderForm.controls['option'].value ?? '',
      reason_others_message:
        this.cancelOrderForm.controls['otherOption'].value ?? '',
    };
    this.ordersService.cancelOrder(data).subscribe({
      next: (result: ApiResponse) => {
        this.isLoading = false;
        if (result?.success) {
          this.message.success(resText);
          this.handleCancel();
        } else {
          this.message.error(
            result?.msg ? result?.msg : 'Order Cancelled Failed!'
          );
        }
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Order Cancelled Failed!');
        }
        this.isLoading = false;
      },
    });
  }

  handleCancel() {
    this.closeModel.emit();
  }
}
