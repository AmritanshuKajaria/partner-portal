import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
})
export class DateTimeComponent implements OnInit {
  @Input() dateTime = '';

  time: string | null = '';

  timeFormate = 'hh:MM a';

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    if (this.dateTime) {
      const formattedTime = this.datePipe.transform(
        this.dateTime,
        this.timeFormate
      );

      const userTimeZoneAbbreviation = moment.tz.guess(true);
      const abbreviation = moment.tz(userTimeZoneAbbreviation).format('z');

      this.time = `${formattedTime} (${abbreviation})`;
    }
  }
}
