import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiResponse } from 'src/app/shared/model/common.model';
import { OrdersService } from 'src/app/shared/service/orders.service';

@Component({
  selector: 'app-po-clarification',
  templateUrl: './po-clarification.component.html',
  styleUrls: ['./po-clarification.component.scss'],
})
export class PoClarificationComponent implements OnInit, OnChanges {
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
      phone: new FormControl(''),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // This is to reset the form when opening it again
    if (changes['isVisible']?.currentValue) {
      this.poClarificationForm.reset();
    }
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
      next: (result: ApiResponse) => {
        this.isLoading = false;
        if (result.success) {
          this.message.success('PO clarification successfully!');
          this.close.emit();
        } else {
          this.message.error(
            result?.msg ? result?.msg : 'Failed to clarify PO.'
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
