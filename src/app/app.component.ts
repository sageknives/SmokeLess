import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { UserService } from '../providers/user-service';
import { User } from '../models/user/user';
import { AppConfig } from './app-config';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = 'LoginPage';
  pages: Array<{ title: string, component: any }>;
  logoutButton = { title: 'Logout', component: 'LoginPage' };

  private versionNumber: string = AppConfig.VERSION_NUMBER;

  constructor(
    private platform: Platform, 
    private statusBar: StatusBar, 
    private splashScreen: SplashScreen,
    private userService: UserService
  ) {
    this.initializeApp();
  }
  setMenu() {
    this.pages = [
      { title: "Welcome", component: undefined },
      { title: 'Home', component: 'HomePage' },
      { title: 'List', component: 'ListPage' },
      { title: 'Graph', component: 'GraphPage' },
      { title: 'Preferences', component: undefined },
      { title: 'Edit Profile', component: 'EditProfile' },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.setMenu();
      // this.userService.listenToUser().subscribe(
      //   (user:User)=>{
      //     let name = user ? user.getUsername() : "";
      //     this.pages[0].title = "Welcome " + name;
      //   }
      // )
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    if (page.title === 'Logout') {
      this.userService.logout()
        .then(() => {
          this.nav.setRoot('LoginPage');
        }).catch(error => {
          console.log('failed to logout.');
        });
    }else {
      this.nav.push(page.component);
    }
  }
}