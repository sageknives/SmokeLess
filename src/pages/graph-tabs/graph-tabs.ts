import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, Tabs } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'graph-tabs.html'
})
export class GraphTabsPage {

  tab1Root = 'DailyGraphPage';
  tab2Root = 'MonthlyGraphPage';
  @ViewChild('myTabs') tabRef: Tabs; 

  constructor(
    private navParams:NavParams
  ) {
    

  }
  ionViewWillEnter() {
    let selectedTab = this.navParams.get('id');
    if(selectedTab !== undefined) this.tabRef.select(selectedTab?selectedTab:0, {}); // In the method where you want set tab.
  }
}
