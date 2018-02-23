import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { UserService } from '../../providers/user-service';
import { ToastService } from '../../providers/toast-service';
import { User } from '../../models/user/user';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  private user: User;
  private submitted: boolean = false;

  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public toast: ToastService
  ) {
    this.user = User.fromJSON({
      _id: undefined,
      username: "",
      password: "",
      goal: 20,
      loggedIn: false
    })
  }

  ionViewDidLoad() {
  }

  register(form: NgForm) {
    if (!form.valid) {
      this.submitted = true;
    } else {
      this.userService.register(this.user)
        .then(() => {
          this.navCtrl.pop();
        }).catch(error => {
          this.toast.showError(error);
        });
    }
  }
}
