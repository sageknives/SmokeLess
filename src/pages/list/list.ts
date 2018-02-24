import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  private user:User;
  private entries = new Array<Entry>();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService,
    private smokingService:SmokingService,
    private toast:ToastService
  ) {
    // for (let i = 0; i < 25; i++) {
    //   let numString = i>9?i:"0"+i;
    //   this.entries.push(new Entry(undefined,"2018-02-"+numString+":00:00Z",1,undefined));
    // }
  }

  ionViewDidLoad() {
    this.refresh();
  }

  refresh(){
    this.user = this.userService.getCurrentUser();
    this.smokingService.getAllEntries(this.user.getId())
    .then((entries:Entry[])=>{
      this.entries = entries;
    }).catch(this.toast.showError);
  }

  goToEntry(entry: Entry) {
    this.navCtrl.push('EntryPage',{id:entry.getId()});
  }

  addEntry(){
    this.navCtrl.push('EntryPage');
  }

}
