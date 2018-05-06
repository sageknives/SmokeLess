import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExperimentalGraphPage } from './experimental-graph';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ExperimentalGraphPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ExperimentalGraphPage),
  ],
})
export class ExperimentalGraphPageModule {}
