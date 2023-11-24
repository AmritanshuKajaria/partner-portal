import { NgModule } from '@angular/core';
import { TwoDigitDecimaNumberDirective } from './directives/two-digit-decimal-number.directive';
import { UtcTimeToIstTimeConverterPipe } from './pipes/utctime-to-local';
import { utcDateToLocalConverterPipe } from './pipes/utcdate-to-local';
import { CustomDatePipe } from './pipes/custom-date.pipe';

@NgModule({
  declarations: [
    TwoDigitDecimaNumberDirective,
    UtcTimeToIstTimeConverterPipe,
    utcDateToLocalConverterPipe,
    CustomDatePipe,
  ],
  imports: [],
  exports: [
    TwoDigitDecimaNumberDirective,
    UtcTimeToIstTimeConverterPipe,
    utcDateToLocalConverterPipe,
    CustomDatePipe,
  ],
})
export class SharedModule {}
