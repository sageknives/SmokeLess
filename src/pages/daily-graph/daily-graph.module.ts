import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DailyGraphPage } from './daily-graph';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    DailyGraphPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(DailyGraphPage),
  ],
})
export class DailyGraphPageModule {}
