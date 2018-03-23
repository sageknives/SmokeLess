import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'formatToHourMinute',
    pure: true
})
export class FormatToHourMinute implements PipeTransform {
    /**
     * Takes a value and makes it lowercase.
     */
    transform(now: number, started: number) {
        let duration = now - started;
        return this.hhmmss(Math.round(duration / 1000));
    }
    pad(num) {
        return ("0" + num).slice(-2);
    }
    hhmmss(secs) {
        let isNegative = secs < 0 ? true : false;
        secs = isNegative ? Math.abs(secs) : secs;
        let minutes = Math.floor(secs / 60);
        secs = secs % 60;
        let hours = Math.floor(minutes / 60)
        minutes = minutes % 60;
        return (isNegative?"-":"")+this.pad(hours) + ":" + this.pad(minutes) + ":" + this.pad(secs);
    }
}