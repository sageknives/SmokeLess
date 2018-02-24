import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'toLocalDate',
})
export class ToLocalDate implements PipeTransform {

    transform(value: string, ...args) {
      return moment(value).format('MMM DD YYYY');
    }
}
