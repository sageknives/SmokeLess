import { Component } from '@angular/core';
import { NavController, IonicPage, App } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { User } from '../../models/user/user';
import { ToastService } from '../../providers/toast-service';
import { SmokingService } from '../../providers/smoking-service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private title = "Smoke Less";
  private user: User;

  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private smokingService:SmokingService,
    private toast: ToastService,
    public appCtrl: App
  ) {

  }

  ionViewWillEnter(){
    this.user = this.userService.getCurrentUser();
    if (!this.user) {
      this.navCtrl.setRoot('LoginPage');
      this.toast.show("Please login to continue");
    }
  }

  attemptToSmoke() {
    this.toast.messageConfirm(
      "Smoke now?",
      "Do you want to smoke now or can you wait 5 minutes more?",
      "Wait", "Smoke")
      .then((smoke:boolean)=>{
        if(smoke) this.smokeNow();
      }).catch(this.toast.showError);
  }

  smokeNow(){    
    this.smokingService.addEntry(new Date().toISOString(),this.user.getId())
    .then((wasAdded)=>{
      if(wasAdded) this.toast.show("Smoking");
      else this.toast.show("Failed to add entry, Please try again.");
    }).catch(this.toast.showError);
  }

  gotoAnalytics(){
    this.appCtrl.getRootNav().push('GraphTabsPage')
  }

}
