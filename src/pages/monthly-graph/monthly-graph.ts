import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-monthly-graph',
  templateUrl: 'monthly-graph.html',
})
export class MonthlyGraphPage {
  private title = "Monthly Graph";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private appCtrl:App
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GraphPage');
  }

  gotoHome(){
    this.appCtrl.getRootNav().pop();
  }
}
