import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonthlyGraphPage } from './monthly-graph';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MonthlyGraphPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(MonthlyGraphPage),
  ],
})
export class MonthlyGraphPageModule {}
