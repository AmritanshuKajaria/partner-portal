import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-ra',
  templateUrl: './add-ra.component.html',
  styleUrls: ['./add-ra.component.scss'],
})
export class AddRa {
  @Output() close = new EventEmitter();

  addRaForm!: FormGroup;
  isLoading: boolean = false;

  constructor() {
    // initialize addra form
    this.addRaForm = new FormGroup({
      raInput: new FormControl('', Validators.required),
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

    if (this.addRaForm.valid) {
      console.log(this.addRaForm.value.raInput);
      this.close.emit();
    }
  }
}
