import { Pipe, PipeTransform } from '@angular/core';

import { DatePipe } from '@angular/common';
import * as moment from 'moment';

let AppDateFormate = 'MMM d, y';

@Pipe({
  name: 'customDate',
})
export class CustomDatePipe implements PipeTransform {
  private datePipe: DatePipe = new DatePipe('en-US');
  transform(date: any, timeFormate: string = ''): string | null {
    if (timeFormate) {
      const dateTimeFormate = AppDateFormate + timeFormate;
      return date && moment(date).isValid()
        ? this.datePipe.transform(date, dateTimeFormate)
        : '';
    } else {
      return date && moment(date).isValid()
        ? this.datePipe.transform(date, AppDateFormate)
        : '';
    }
  }
}

export default AppDateFormate;
