import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AddRaPayload } from 'src/app/shared/model/returns.model';
import { ReturnService } from 'src/app/shared/service/return.service';

@Component({
  selector: 'app-add-ra',
  templateUrl: './add-ra.component.html',
  styleUrls: ['./add-ra.component.scss'],
})
export class AddRa implements OnInit {
  @Input() poNo: string = '';
  @Output() close = new EventEmitter();

  addRaForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private returnService: ReturnService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    // initialize addra form
    this.addRaForm = new FormGroup({
      ra: new FormControl('', Validators.required),
    });
  }

  handleCancel() {
    this.close.emit();
  }

  // for addRa
  submitAddRaForm() {
    if (this.addRaForm.invalid) {
      for (const i in this.addRaForm.controls) {
        this.addRaForm.controls[i].markAsDirty();
        this.addRaForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    this.isLoading = true;
    const data: AddRaPayload = {
      po_no: this.poNo,
      ra: this.addRaForm.value.ra,
    };

    this.returnService.addRa(data).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.message.success('RA number added successfully!');
          this.close.emit();
        } else {
          this.message.error(
            res?.error_message ? res?.error_message : 'Failed to Add RA #!'
          );
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        if (!error?.error_shown) {
          this.message.error('Failed to Add RA #!');
        }
      },
    });
  }
}
