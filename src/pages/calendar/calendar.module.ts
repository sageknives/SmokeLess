import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarPage } from './calendar';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    CalendarPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(CalendarPage),
  ],
})
export class CalendarPageModule {}
