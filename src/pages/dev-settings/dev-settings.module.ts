import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DevSettingsPage } from './dev-settings';

@NgModule({
  declarations: [
    DevSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(DevSettingsPage),
  ],
})
export class DevSettingsPageModule {}
