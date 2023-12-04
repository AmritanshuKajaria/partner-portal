import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'utcDateToLocalConverter',
})
export class utcDateToLocalConverterPipe implements PipeTransform {
  transform(date: string, isFullDate: boolean = false) {
    return isFullDate
      ? moment.utc(date).local().format('MMM DD, YYYY hh:mm a')
      : moment.utc(date).local().format('MMM DD, YYYY');
  }
}
