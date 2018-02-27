import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountPage } from './account';
import { PipesModule } from '../../pipes/pipes.module';
import { DatePickerModule } from 'ion-datepicker';

@NgModule({
  declarations: [
    AccountPage,
  ],
  imports: [
    PipesModule,
    DatePickerModule,
    IonicPageModule.forChild(AccountPage),
  ],
})
export class AccountPageModule {}
