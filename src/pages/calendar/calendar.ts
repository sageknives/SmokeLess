import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { ToastService } from '../../providers/toast-service';
import { User } from '../../models/user/user';
import * as moment from 'moment';
import { SmokingService } from '../../providers/smoking-service';
import { Entry } from '../../models/smoke/entry';

interface DateBox {
  date: number,
  count: number,
  goal?: number
}

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {
  title: string = "Calendar";
  users: User[] = new Array<User>();
  private user: User = User.fromJSON({});
  selectedDate: string = moment(Date.now()).startOf('day').toISOString();
  dateboxes: DateBox[] = new Array<DateBox>();
  total: number = 0;
  average: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appCtrl: App,
    private userService: UserService,
    private smokingService: SmokingService,
    private toast: ToastService
  ) {
  }

  prevDate() {
    let tempDate = moment(this.selectedDate);
    while (tempDate.get('date') !== 1) tempDate.add(1, 'day');
    tempDate.add(-1, 'month').startOf('day');
    this.selectedDate = tempDate.format();
    this.setUpAndDisplayCalendar();
  }
  nextDate() {
    let tempDate = moment(this.selectedDate);
    while (tempDate.get('date') !== 1) tempDate.add(1, 'day');
    tempDate.add(1, 'month').startOf('day');
    this.selectedDate = tempDate.format();
    this.setUpAndDisplayCalendar();
  }

  ionViewWillEnter() {
    this.userService.getLoggedInUser()
      .then((user: User) => {
        this.user = user;
        if (!this.user) {
          this.navCtrl.setRoot('LoginPage');
          this.toast.show("Please login to continue");
        }
        else {
          let today = moment(this.selectedDate);
          while (today.get('date') !== 1) today.add(-1, 'day');
          this.selectedDate = today.startOf('day').format();
          this.setUpAndDisplayCalendar();
        }
      })
  }

  setUpAndDisplayCalendar() {
    let total: number = 0;
    let startMoment = moment(this.selectedDate).startOf('day');
    let endMoment = moment(startMoment).add(1, 'month');
    let monthLength = startMoment.daysInMonth();
    let start = startMoment.toISOString();
    let end = endMoment.toISOString();
    while (startMoment.get('day') !== 0) startMoment.add(-1, 'day');
    while (endMoment.get('day') !== 0) endMoment.add(1, 'day');
    let monthDayCount = endMoment.diff(startMoment, 'days');
    while (this.dateboxes.length > 0) this.dateboxes.pop();

    for (let i = 0; i < monthDayCount; i++) {
      this.dateboxes.push({ date: startMoment.get('date'), count: 0,goal:this.user.getGoal() });
      startMoment.add(1, 'day');
    }

    this.smokingService.getEntries(this.user.getId(), start, end)
      .then((entries: Entry[]) => {
        entries.forEach(entry=>{
          let box = this.dateboxes.find(box=>box.date === moment(entry.getStart()).get('date'));
          if(box){
            if(!box.count) box.count =1;
            else box.count++;
          }
        })
        console.log("days", this.dateboxes);
        this.total = entries.length;
        this.average = Number.parseFloat((this.total / monthLength).toFixed(2));
      }).catch(this.toast.showError);
  }

  gotoAnalytics() {
    this.appCtrl.getRootNav().push('GraphTabsPage')
  }

}
