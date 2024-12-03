import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxValue',
})
export class MaxValuePipe implements PipeTransform {
  transform(value: number[]): number  {
    if (!Array.isArray(value) || value.length === 0) {
      return 0;
    }
    return Math.max(...value);
  }
}
