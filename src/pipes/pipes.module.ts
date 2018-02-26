import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { ToLocalDate } from './to-local-date';
import { ToLocalDateTime } from './to-local-date-time';
import { ToLocalTime } from './to-local-time';
import { ToLocalMonthYear } from './to-local-month-year';

@NgModule({
  declarations: [
    ToLocalDate,
    ToLocalTime,
    ToLocalDateTime,
    ToLocalMonthYear
  ],
  imports: [IonicModule],
  exports: [
    ToLocalDate,
    ToLocalTime,
    ToLocalDateTime,
    ToLocalMonthYear
  ]
})
export class PipesModule { }