import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import * as moment from 'moment';
import { Entry } from '../../models/smoke/entry';
import { SmokingService } from '../../providers/smoking-service';
import { UserService } from '../../providers/user-service';
import { User } from '../../models/user/user';
import { ToastService } from '../../providers/toast-service';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
  private title = "List View";
  private user: User;
  private entries = new Array<Entry>();
  selectedDate: string = moment(Date.now()).startOf('day').toISOString();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService,
    private smokingService: SmokingService,
    private toast: ToastService,
    public appCtrl: App

  ) {
  }

  ionViewDidLoad() {

  }
  ionViewWillEnter() {
    this.refresh();
  }
  refresh() {
    this.userService.getLoggedInUser()
      .then((user: User) => {
        this.user = user;
        if (!this.user) {
          this.navCtrl.setRoot('LoginPage');
          this.toast.show("Please login to continue");
          return;
        } else {
          this.selectedDate = moment(Date.now()).startOf('day').toISOString();
          return this.addDay();
        }
      }).then((entries: Entry[]) => {
        this.entries = entries.sort((a, b) => {
          return a.getStart() > b.getStart() ? -1 : a.getStart() < b.getStart() ? 1 : 0;
        });
      }).catch(this.toast.showError);
  }

  addDay(): Promise<Entry[]> {
    return new Promise((resolve, reject) => {
      let start = moment(this.selectedDate).startOf('day').toISOString();
      let end = moment(start).add(1, 'day').toISOString();
      this.smokingService.getEntries(this.user.getId(), start, end)
        .then((entries: Entry[]) => {
          resolve(entries);
        }).then(reject);
    })
  }

  goToEntry(entry: Entry) {
    this.navCtrl.push('EntryPage', { id: entry.getId() });
  }

  addEntry() {
    this.navCtrl.push('EntryPage');
  }

  gotoAnalytics() {
    this.appCtrl.getRootNav().push('GraphTabsPage')
  }

  getMore() {
    this.selectedDate = moment(this.selectedDate).add(-1, 'day').startOf('day').toISOString();
    this.addDay()
      .then((entries: Entry[]) => {
        this.entries = this.entries.concat(entries).sort((a, b) => {
          return a.getStart() > b.getStart() ? -1 : a.getStart() < b.getStart() ? 1 : 0;
        });
      }).catch(error => {
        this.toast.show("Error getting previous day");
      })

  }

}
