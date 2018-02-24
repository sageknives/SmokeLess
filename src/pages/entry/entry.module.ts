import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntryPage } from './entry';
import { PipesModule } from '../../pipes/pipes.module';
import { DatePickerModule } from 'ion-datepicker';

@NgModule({
  declarations: [
    EntryPage,
  ],
  imports: [
    PipesModule,
    DatePickerModule,
    IonicPageModule.forChild(EntryPage),
  ],
})
export class EntryPageModule {}
