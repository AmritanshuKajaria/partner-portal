import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrdersService } from 'src/app/shared/service/orders.service';

@Component({
  selector: 'app-po-clarification',
  templateUrl: './po-clarification.component.html',
  styleUrls: ['./po-clarification.component.scss'],
})
export class PoClarificationComponent implements OnInit {
  @Input() poNo: string = '';
  @Output() close = new EventEmitter();

  isLoading: boolean = false;
  poClarificationForm!: FormGroup;

  constructor(
    private ordersService: OrdersService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.poClarificationForm = new FormGroup({
      detail: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl(''),
    });
  }

  submit() {
    const data = {
      po_number: this.poNo,
      clarification_message: 'Shipping Issue',
      contact_via: 'Email',
      user_email: 'sudip.das@123srores.com',
    };
    this.ordersService.clarificationOrders(data).subscribe((res: any) => {
      if (res.success) {
        this.message.success('PO clarification successfully!');
      }
    });
  }

  handleCancel() {
    this.close.emit();
  }
}
