import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {
  title: string = "Calendar";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appCtrl: App
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarPage');
  }

  gotoAnalytics() {
    this.appCtrl.getRootNav().push('GraphTabsPage')
  }

}
