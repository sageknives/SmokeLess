import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'toLocalMonthYear',
})
export class ToLocalMonthYear implements PipeTransform {

    transform(value: string, ...args) {
      return moment(value).format('MMM YYYY');
    }
}