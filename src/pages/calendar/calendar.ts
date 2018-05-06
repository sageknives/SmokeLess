import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { ToastService } from '../../providers/toast-service';
import { User } from '../../models/user/user';
import * as moment from 'moment';
import { SmokingService } from '../../providers/smoking-service';
import { Entry } from '../../models/smoke/entry';

interface DateBox {
  date: number | string,
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
  dayGoals = new Array<number>();
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
          this.dayGoals = this.user.getDayGoals();
          this.setUpAndDisplayCalendar();
        }
      })
  }
 

  setUpAndDisplayCalendar() {
    let total: number = 0;
    let startMoment = moment(this.selectedDate).startOf('day');
    let month = startMoment.get('month');
    let endMoment = moment(startMoment).add(1, 'month');
    let monthLength = startMoment.daysInMonth();
    let start = startMoment.toISOString();
    let end = endMoment.toISOString();
    while (startMoment.get('day') !== 0) startMoment.add(-1, 'day');
    while (endMoment.get('day') !== 0) endMoment.add(1, 'day');
    let monthDayCount = endMoment.diff(startMoment, 'days');
    while (this.dateboxes.length > 0) this.dateboxes.pop();

    for (let i = 0; i < monthDayCount; i++) {
      let dateIndex = startMoment.get('year') + '-' + this.toDoubleDigit(startMoment.get('month') + 1) + '-' + this.toDoubleDigit(startMoment.get('date'));
      this.dateboxes.push({
        date: startMoment.get('month') === month
          ? startMoment.get('date')
          : "X",
        count: 0,
        goal: this.user.getDayGoal(startMoment.toISOString())
      });
      startMoment.add(1, 'day');
    }
    this.smokingService.getEntries(this.user.getId(), start, end)
      .then((entries: Entry[]) => {
        entries.forEach(entry => {
          let box = this.dateboxes.find(box => box.date === moment(entry.getStart()).get('date'));
          if (box) {
            if (!box.count) box.count = entry.getNumberCount()/100;
            else box.count += entry.getNumberCount()/100;
          }
        })
        console.log("days", this.dateboxes);
        this.total = entries.reduce((total,entry)=>total + entry.getNumberCount()/100, 0);
        let recordedDays = this.dateboxes.filter(d=>d.count > 0);
        this.average = Number.parseFloat((this.total / recordedDays.length).toFixed(2));
        if(Number.isNaN(this.average)) this.average = 0;
      }).catch(this.toast.showError);
  }

  toDoubleDigit(num: number): string {
    if (num < 10) return "0" + num;
    else return num + "";
  }

  gotoAccount() {
    this.appCtrl.getRootNav().push('AccountPage');
  }

}
