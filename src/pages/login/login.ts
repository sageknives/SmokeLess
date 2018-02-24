import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { UserService } from '../../providers/user-service';
import { ToastService } from '../../providers/toast-service';
import { User } from '../../models/user/user';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private user: User = User.fromJSON({});
  private submitted: boolean = false;
  private hideForm: boolean = true;

  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public toast: ToastService,
    public menu: MenuController
  ) {

  }

  loginWithForm(form: NgForm) {
    if (!form.valid) {
      this.submitted = true;
    } else {
      this.userService.login(this.user)
        .then(result => {
          this.toast.show("hi! " + this.user.getUsername() + ". Thanks for Logging in!");
          this.enableMenu(true);
          this.navCtrl.setRoot('TabsPage');
        }).catch(error => {
          this.toast.showError(error);
        });
    }
  }

  register() {
    this.navCtrl.push('RegisterPage');
  }

  enableMenu(isEnabled: boolean) {
    this.menu.enable(isEnabled);
    this.menu.swipeEnable(isEnabled);
  }

  hideKeyboard($event) {
    $event.target.blur();
  }

  ionViewCanEnter() {
    this.toast.showLoading();
    this.enableMenu(false);
    this.userService.getLoggedInUser()
      .then((dbUser: User) => {
        this.user = dbUser;
        if (this.user.getUsername() && this.user.getPassword()) {
          this.enableMenu(true);
          this.navCtrl.setRoot('TabsPage');
          this.toast.hideLoading();
        } else {
          this.toast.hideLoading();
          this.hideForm = false;
        }
      }).catch(error => {
        this.toast.hideLoading();
        this.hideForm = false;
      });
  }

}
