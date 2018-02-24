import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DailyGraphPage } from './daily-graph';

@NgModule({
  declarations: [
    DailyGraphPage,
  ],
  imports: [
    IonicPageModule.forChild(DailyGraphPage),
  ],
})
export class DailyGraphPageModule {}
