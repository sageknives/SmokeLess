import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GraphTabsPage } from './graph-tabs';

@NgModule({
  declarations: [
    GraphTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(GraphTabsPage),
  ],
})
export class GraphTabsPageModule {}
