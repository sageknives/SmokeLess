import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'toLocalTime',
})
export class ToLocalTime implements PipeTransform {

    transform(value: string, ...args) {
      return moment(value).format('h:mm:ss A');
    }
}
