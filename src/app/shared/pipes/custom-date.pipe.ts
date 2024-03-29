import { Pipe, PipeTransform } from '@angular/core';

import { DatePipe } from '@angular/common';

let AppDateFormate = 'MMM d, y';

@Pipe({
  name: 'customDate',
})
export class CostomDatePipe implements PipeTransform {
  private datePipe: DatePipe = new DatePipe('en-US');
  transform(date: any, timeFormate: string = ''): string | null {
    if (timeFormate) {
      const dateTimeFormate = AppDateFormate + timeFormate;
      return date ? this.datePipe.transform(date, dateTimeFormate) : '';
    } else {
      return date ? this.datePipe.transform(date, AppDateFormate) : '';
    }
  }
}

export default AppDateFormate;
