import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeeklyGraphPage } from './weekly-graph';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    WeeklyGraphPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(WeeklyGraphPage),
  ],
})
export class WeeklyGraphPageModule {}
