import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'toLocalDateTime',
})
export class ToLocalDateTime implements PipeTransform {

    transform(value: string, ...args) {
        return moment(value).format('ddd MMM DD YYYY h:mm:ss A');
    }
}
