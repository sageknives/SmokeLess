import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonthlyGraphPage } from './monthly-graph';

@NgModule({
  declarations: [
    MonthlyGraphPage,
  ],
  imports: [
    IonicPageModule.forChild(MonthlyGraphPage),
  ],
})
export class MonthlyGraphPageModule {}
