import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, Tabs } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'graph-tabs.html'
})
export class GraphTabsPage {

  tab1Root = 'DailyGraphPage';
  tab2Root = 'WeeklyGraphPage';
  tab3Root = 'MonthlyGraphPage';
  @ViewChild('graphTabs') tabRef2: Tabs; 
  color="primary";

  constructor(
    private navParams:NavParams
  ) {
    

  }
  ionViewWillEnter() {
    let selectedTab = this.navParams.get('id');
    if(selectedTab !== undefined) this.tabRef2.select(selectedTab?selectedTab:0, {}); // In the method where you want set tab.
  }
}
