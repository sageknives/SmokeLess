import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { SmokingService } from '../../providers/smoking-service';
import { ToastService } from '../../providers/toast-service';
import { User } from '../../models/user/user';
import { DatePickerDirective } from 'ion-datepicker';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  @ViewChild(DatePickerDirective) private datepickerDirective: DatePickerDirective;
  private title = "Account";
  private user: User = User.fromJSON({});
  private chosenStartDate = moment(Date.now()).toDate();
  private chosenEndDate = moment(Date.now()).add(2,'month').toDate();
  private submitted: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private userService: UserService,
    private smokingService: SmokingService,
    private toast: ToastService
  ) {
  }

  public closeDatepicker() {
    this.datepickerDirective.modal.dismiss();
  }

  ionViewDidLoad() {
    this.userService.getLoggedInUser()
    .then((user:User)=>{
      this.user = user;
      if (!this.user) {
        this.navCtrl.setRoot('LoginPage');
        this.toast.show("Please login to continue");
        return;
      }else{
        if(this.user.getStartDate()) this.chosenStartDate = moment(this.user.getStartDate()).toDate();
        else this.user.setStartDate(this.chosenStartDate.toISOString());
        if(this.user.getEndDate()) this.chosenEndDate = moment(this.user.getEndDate()).toDate();
        else this.user.setEndDate(this.chosenEndDate.toISOString());
      }
    }).catch(error=>{
      this.toast.showError(error);
    })
  }

  updateStartDate(dateString: string) {
    let momentDate = moment(dateString);
    this.user.setStartDate(momentDate.toISOString());
  }
  updateEndDate(dateString: string) {
    let momentDate = moment(dateString);
    this.user.setEndDate(momentDate.toISOString());
  }

  updateAccount(form: NgForm) {
    if (!form.valid) {
      this.submitted = true;
    } else {
      this.userService.saveUserGoal(this.user)
        .then(result => {
          this.toast.show("Account updated");
          this.navCtrl.pop();
        }).catch(error => {
          this.toast.showError(error);
        });
    }
  }

}
