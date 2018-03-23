import { Component } from '@angular/core';
import { NavController, IonicPage, App } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { User } from '../../models/user/user';
import { ToastService } from '../../providers/toast-service';
import { SmokingService } from '../../providers/smoking-service';
import * as moment from 'moment';
import { Entry } from '../../models/smoke/entry';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private title = "Smoke Less";
  private user: User;
  private total: number = 0;
  private goal: number = 0;

  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private smokingService: SmokingService,
    private toast: ToastService,
    public appCtrl: App
  ) {

  }

  ionViewWillEnter() {
    this.userService.getLoggedInUser()
      .then((user: User) => {
        this.user = user;
        if (!this.user) {
          this.navCtrl.setRoot('LoginPage');
          this.toast.show("Please login to continue");
        }
        this.getCount();
      })
  }

  attemptToSmoke() {
    this.toast.messageConfirm(
      "Smoke now?",
      "Do you want to smoke now or can you wait 5 minutes more?",
      "Wait", "Smoke")
      .then((smoke: boolean) => {
        if (smoke) this.smokeNow();
      }).catch(this.toast.showError);
  }

  smokeNow() {
    this.smokingService.addEntry(new Date().toISOString(), this.user.getId())
      .then((wasAdded) => {
        if (wasAdded){
          this.toast.show("Smoking");
          this.getCount();
        } 
        else this.toast.show("Failed to add entry, Please try again.");
      }).catch(this.toast.showError);
  }

  getCount() {
    let start = moment(Date.now()).startOf('day').toISOString();
    let end = moment(start).add(1, 'day').toISOString();
    this.smokingService.getEntries(this.user.getId(),start,end)
      .then((entries: Entry[]) => {
        
        this.total = entries.length;;
        this.total = this.total?this.total:0;
        this.goal = this.user.getDayGoal(start);
      }).catch(this.toast.showError);
  }

  gotoAccount() {
    this.appCtrl.getRootNav().push('AccountPage');
  }

}
