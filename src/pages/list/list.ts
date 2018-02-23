import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Entry } from '../../models/entry';

/**
 * Generated class for the ListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
  private title = "List View";
  private entries = new Array<Entry>();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    for (let i = 0; i < 25; i++) {
      let numString = i>9?i:"0"+i;
      this.entries.push(new Entry(undefined,"2018-02-"+numString+":00:00Z",undefined));
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  goToEntry(entry?: Entry) {
    this.navCtrl.push('EntryPage');
  }

}
