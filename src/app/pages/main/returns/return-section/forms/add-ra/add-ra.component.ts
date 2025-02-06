import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-ra',
  templateUrl: './add-ra.component.html',
  styleUrls: ['./add-ra.component.scss'],
})
export class AddRa {
  @Output() closeModal = new EventEmitter();

  addRaForm!: FormGroup;
  isLoading: boolean = false;

  constructor() {
    // initialize addra form
    this.addRaForm = new FormGroup({
      raInput: new FormControl(''),
    });
  }

  close() {
    this.closeModal.emit();
  }

  // for addRa
  submitAddRaForm() {
    if (this.addRaForm.valid) {
      console.log(this.addRaForm.value.raInput);
    }
  }
}
