import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-daily-graph',
  templateUrl: 'daily-graph.html',
})
export class DailyGraphPage {
  private title = "Daily Graph";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public appCtrl: App
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GraphPage');
  }

  gotoHome(){
    this.appCtrl.getRootNav().pop();
  }

}
