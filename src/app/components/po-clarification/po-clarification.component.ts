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
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(''),
    });
  }

  submit() {
    const data = {
      po_no: this.poNo,
      message: this.poClarificationForm.controls['detail'].value,
      name: this.poClarificationForm.controls['name'].value,
      email: this.poClarificationForm.controls['email'].value,
      phone: this.poClarificationForm.controls['phone'].value,
    };
    this.ordersService.clarificationOrders(data).subscribe((res: any) => {
      if (res.success) {
        this.handleCancel();
        this.message.success('PO clarification successfully!');
      }
    });
  }

  handleCancel() {
    this.close.emit();
  }
}
