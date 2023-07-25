import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(private ordersService: OrdersService) {}

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
      po_number: this.poNo,
      reason: this.cancelOrderForm.controls['option'].value ?? '',
      reason_others_message:
        this.cancelOrderForm.controls['otherOption'].value ?? '',
    };
    this.ordersService.cancelOrder(data).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.handleCancel();
      },
      (err) => (this.isLoading = false)
    );
  }

  handleCancel() {
    this.closeModel.emit();
  }
}
