import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
})
export class DateTimeComponent {
  @Input() dateTime = '';
  @Input() timeZone = '';
}
