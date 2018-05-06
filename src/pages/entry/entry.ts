import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Range } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { SmokingService } from '../../providers/smoking-service';
import { ToastService } from '../../providers/toast-service';
import { User } from '../../models/user/user';
import { Entry } from '../../models/smoke/entry';
import { DatePickerDirective } from 'ion-datepicker';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-entry',
  templateUrl: 'entry.html',
})
export class EntryPage {
  @ViewChild(DatePickerDirective) private datepickerDirective: DatePickerDirective;
  private title = "Entry";
  private entry: Entry = new Entry(undefined, undefined, undefined, undefined);
  private user: User;
  private chosenDate = moment(Date.now()).toDate();
  private chosenTime = moment(Date.now()).toISOString();
  private percent: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService,
    private smokingService: SmokingService,
    private toast: ToastService
  ) {
  }
  public closeDatepicker() {
    this.datepickerDirective.modal.dismiss();
  }

  ionViewDidLoad() {
    this.user = this.userService.getCurrentUser();
    let id = this.navParams.get("id");
    if (id) {
      this.smokingService.getEntry(id)
        .then((entry: Entry) => {
          this.entry = entry;
          this.chosenDate = moment(entry.getStart()).toDate();
          this.chosenTime = moment(entry.getStart()).format();
          this.percent = this.entry.getNumberCount();
        }).catch(this.toast.showError);
    } else {
      this.chosenDate = moment(Date.now()).toDate();
      this.chosenTime = moment(Date.now()).format();
      this.entry.setStart(new Date().toISOString());
      this.entry.setNumberCount(1);
      this.percent = this.entry.getNumberCount();
    }
  }

  updateDate(dateString: string) {
    let momentDate = moment(dateString);
    let entryDate = moment(this.entry.getStart());
    console.log(entryDate.toISOString());
    entryDate.date(momentDate.get('date'));
    entryDate.month(momentDate.get('month'));
    entryDate.year(momentDate.get('year'));
    console.log(entryDate.toISOString());
    this.entry.setStart(entryDate.toISOString());
  }

  updateTime(dateString: string) {
    let momentDate = moment(dateString);
    let entryDate = moment(this.entry.getStart());
    console.log(entryDate.toISOString());
    entryDate.hour(momentDate.get('hour'));
    entryDate.minute(momentDate.get('minute'));
    console.log(entryDate.toISOString());
    this.entry.setStart(entryDate.toISOString());
  }

  updateNumberCount(percent: Range) {
    this.entry.setNumberCount(percent.value);
  }

  saveEntry() {
    if (this.entry.getId()) {
      this.smokingService.updateEntry(this.entry.getId(), this.entry.getNumberCount(), this.entry.getStart())
        .then((wasUpdated: boolean) => {
          this.toast.show("Updated Entry");
          this.navCtrl.pop();
        }).catch(error => {
          this.toast.show("problem updating entry");
        })
    } else {
      this.smokingService.addEntry(this.entry.getStart(), this.entry.getNumberCount(), this.user.getId())
        .then((wasSaved) => {
          this.toast.show("Saved Entry");
          this.navCtrl.pop();
        }).catch(error => {
          this.toast.show("problem saving entry");
        })
    }
  }

  deleteEntry() {
    this.smokingService.deleteEntry(this.entry.getId())
      .then((wasUpdated: boolean) => {
        this.toast.show("Deleted Entry");
        this.navCtrl.pop();
      }).catch(error => {
        this.toast.show("problem deleting entry");
      })
  }

}
