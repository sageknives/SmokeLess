import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListPage } from './list';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ListPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ListPage),
  ],
})
export class ListPageModule {}
