import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-approve-credit',
  templateUrl: './approve-credit.component.html',
  styleUrls: ['./approve-credit.component.scss'],
})
export class ApproveCredit {
  @Output() closeModal = new EventEmitter();

  approveCreditForm!: FormGroup;
  isLoading: boolean = false;

  constructor() {
    this.approveCreditForm = new FormGroup({
      cn: new FormControl(''),
    });
  }

  close() {
    this.closeModal.emit();
  }

  submitForm() {
    if (this.approveCreditForm.valid) {
      const formValue = this.approveCreditForm.value;
      console.log('Form Value:', formValue);
    }
  }
}
