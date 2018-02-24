import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { ToLocalDate } from './to-local-date';
import { ToLocalDateTime } from './to-local-date-time';
import { ToLocalTime } from './to-local-time';

@NgModule({
  declarations:[
    ToLocalDate,
    ToLocalTime,
    ToLocalDateTime
  ],
  imports:[IonicModule],
  exports:[
    ToLocalDate,
    ToLocalTime,
    ToLocalDateTime
  ]
})
export class PipesModule{}