import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SmokingService } from '../../providers/smoking-service';
import { ToastService } from '../../providers/toast-service';

@IonicPage()
@Component({
  selector: 'page-dev-settings',
  templateUrl: 'dev-settings.html',
})
export class DevSettingsPage {

  constructor(
    private navCtrl: NavController,
    private smokingService: SmokingService,
    private toast: ToastService
  ) {
  }

  ionViewDidLoad() {
    
  }

}
