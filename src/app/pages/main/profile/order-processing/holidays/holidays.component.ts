import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import AppDateFormate from 'src/app/shared/pipes/custom-date.pipe';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss'],
})
export class HolidaysComponent implements OnInit {
  holidayForm!: FormGroup;
  isLoading: boolean = false;

  AppDateFormate = AppDateFormate;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.holidayForm = this.fb.group({
      holidayDetail: this.fb.array([]),
    });
    this.addHolidays();
  }

  get holidayDetail(): FormArray {
    return this.holidayForm.controls['holidayDetail'] as FormArray;
  }

  newHoliday(): FormGroup {
    return this.fb.group({
      date: '',
      remark: '',
    });
  }

  addHolidays() {
    this.holidayDetail.push(this.newHoliday());
  }

  removeHoliday(i: number) {
    this.holidayDetail.removeAt(i);
  }
}
