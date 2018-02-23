import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, Tabs } from 'ionic-angular';

// import { ListPage } from '../list/list';
// import { GraphPage } from '../graph/graph';
// import { HomePage } from '../home/home';
@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'HomePage';
  tab2Root = 'ListPage';
  tab3Root = 'GraphPage';
  @ViewChild('myTabs') tabRef: Tabs; 

  constructor(
    private navParams:NavParams
  ) {
    

  }
  ionViewWillEnter() {
    let selectedTab = this.navParams.get('id');

    this.tabRef.select(selectedTab?selectedTab:0, {}); // In the method where you want set tab.
  }
}
