import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrdersService } from 'src/app/shared/service/orders.service';

@Component({
  selector: 'app-confirm-shipped',
  templateUrl: './confirm-shipped.component.html',
  styleUrls: ['./confirm-shipped.component.scss'],
})
export class ConfirmShippedComponent implements OnInit {
  @Output() close = new EventEmitter();

  isLoading: boolean = false;
  confirmShippedForm!: FormGroup;

  constructor(
    private ordersService: OrdersService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.confirmShippedForm = this.fb.group({
      carrier: ['', [Validators.required]],
      shipping_date: ['', [Validators.required]],
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

  submit() {
    // const data = {
    //   po_number: this.poNo,
    //   clarification_message: 'Shipping Issue',
    //   contact_via: 'Email',
    //   user_email: 'sudip.das@123srores.com',
    // };
    // this.ordersService.clarificationOrders(data).subscribe((res: any) => {
    //   if (res.success) {
    //     this.message.success('PO clarification successfully!');
    //   }
    // });
  }

  handleCancel() {
    this.close.emit();
  }
}
