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
  @Input() isVisible: boolean = false;
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
    });
  }

  submit() {
    if (this.poClarificationForm.invalid) {
      for (const i in this.poClarificationForm.controls) {
        this.poClarificationForm.controls[i].markAsDirty();
        this.poClarificationForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    this.isLoading = true;
    const data = {
      po_no: this.poNo,
      clarification_message: this.poClarificationForm.value.detail,
      user_name: this.poClarificationForm.value.name,
      user_email: this.poClarificationForm.value.email,
      user_phone: this.poClarificationForm.value.phone,
    };

    this.ordersService.clarificationOrders(data).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.message.success('PO clarification successfully!');
          this.close.emit();
        } else {
          this.message.error(
            res?.error_message ? res?.error_message : 'Failed to clarify PO.'
          );
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        if (!error?.error_shown) {
          this.message.error('Failed to clarify PO.');
        }
      },
    });
  }

  handleCancel() {
    this.isVisible = false;
    this.close.emit();
  }
}
